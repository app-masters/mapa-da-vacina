import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import RollbarProvider from '@ioc:Adonis/Providers/Rollbar';
import Config from '@ioc:Adonis/Core/Config';

import { BaseRepository, BaseModel, ReadModel } from 'firestore-storage';
import { firestore } from 'firebase-admin';

import { errorFactory } from 'App/Exceptions/ErrorFactory';
import QueueUpdate from 'App/Models/QueueUpdate';

import {
  deleteCacheByPrefix,
  getSlug,
  IsNowBetweenTimes,
  minutesDiff,
  parseBoolFromString,
  sanitizeAddress,
  sanitizePlaceTitle,
  sanitizeString,
  sanitizeZip
} from 'App/Helpers';

import { DateTime } from 'luxon';
export interface PlaceType extends BaseModel {
  prefectureId: string;
  title: string;
  internalTitle: string;
  addressStreet: string;
  addressDistrict: string;
  addressCityState: string;
  addressZip?: string;
  googleMapsUrl?: string;
  type: string;
  active: boolean;
  open: boolean;
  queueStatus: string;
  openToday?: boolean;
  openTomorrow?: boolean;

  queueUpdatedAt: firestore.Timestamp;
  openAt?: firestore.Timestamp;
  closeAt?: firestore.Timestamp;

  openWeek?: boolean[];
  openAtWeek?: firestore.Timestamp[];
  closeAtWeek?: firestore.Timestamp[];

  latitude?: number;
  longitude?: number;
  distance?: number;
}

export class PlaceRepository extends BaseRepository<PlaceType> {
  private static instance: PlaceRepository;

  private places: PlaceType[];
  private _snapshotObserver;
  private _activeObserver: boolean = false;
  /**
   * Construtor
   */
  constructor() {
    super(FirebaseProvider.storage, errorFactory);
    console.log('INIT PLACES');

    this._snapshotObserver = FirebaseProvider.db.collectionGroup('place').onSnapshot(
      (docSnapshot) => {
        console.log(`Received doc snapshot place`);
        docSnapshot.docChanges().forEach((d) => {
          // deletar cache da prefeitura que mudou somente
          const cacheKeyPrefix = `prefecture:${d.doc.data().prefectureId}-`;
          // console.log('Deleting cache: ', cacheKey);
          deleteCacheByPrefix(cacheKeyPrefix);
        });
        this.places = docSnapshot.docs.map((d) => {
          return {
            ...this.getObjectFromData(d.data()),
            id: d.id,
            createdAt: d.createTime.toDate(),
            updatedAt: d.updateTime.toDate()
          } as PlaceType;
        });
        this._activeObserver = true;
      },
      (err) => {
        this._activeObserver = false;
        console.log(`Encountered error: ${err}`);
      }
    );
  }

  /**
   * Init places
   */
  public async initPlaces() {
    if (!this._activeObserver) {
      const docSnapshot = await FirebaseProvider.db.collectionGroup('place').get();
      this.places = docSnapshot.docs.map((d) => {
        return {
          ...this.getObjectFromData(d.data()),
          id: d.id,
          createdAt: d.createTime.toDate(),
          updatedAt: d.updateTime.toDate()
        } as PlaceType;
      });
    }
  }

  /**
   * Get Object from Firestore DocumentData
   * @param data DocumentData
   * @returns PlaceType
   */
  private getObjectFromData(data: FirebaseFirestore.DocumentData) {
    return data as PlaceType;
  }

  /**
   * getInstance
   */
  public static getInstance() {
    if (!PlaceRepository.instance) {
      PlaceRepository.instance = new PlaceRepository();
    }
    return PlaceRepository.instance;
  }

  /**
   * findByPrefectureWithCurrentAgenda
   * @param id
   * @returns
   */
  public async findByPrefectureWithCurrentAgenda(prefId: string): Promise<PlaceType[]> {
    const documents = await this.listActive(prefId);

    for (const document of documents) {
      if (!document.id) return [];
      //document.agendas = await AgendaRepository.listAgendaTodayAndTomorrow(prefId, document.id);
    }

    documents.sort((a, b) => {
      return (
        +b.open - +a.open ||
        +(b.openToday ? b.openToday : 0) - +(a.openToday ? a.openToday : 0) ||
        b.type.localeCompare(a.type) ||
        a.title.localeCompare(b.title)
      );
    });

    return documents;
  }

  /**
   * List active places
   * @returns Active places
   */
  public async listActive(prefectureId: string) {
    if (!this._activeObserver) {
      await this.initPlaces();
    }
    return this.places.filter((place) => place.active && place.prefectureId === prefectureId);
  }

  /**
   * Try to get value via snapshot. If it doesn't exist yet, query firestore
   * @param ids
   * @returns
   */
  public async findById(prefectureId: string, placeId: string): Promise<ReadModel<PlaceType> | null> {
    if (this._activeObserver) {
      return this.places.filter((p) => p.id === placeId && p.prefectureId === prefectureId)[0] as ReadModel<PlaceType>;
    }
    return await super.findById(prefectureId, placeId);
  }

  /**
   * Update Open Today with Open Tomorrow field
   */
  public async updateOpenTodayField() {
    if (!this._activeObserver) {
      await this.initPlaces();
    }
    // Will check the open, openAt and CloseAt arrays.
    for (const place of this.places) {
      // 0 - Sunday, 1 - Monday, ... , 6 - Saturday
      const day = new Date().getDay();
      const tomorrow = (day + 1) % 7;
      // If the arrays are set, use them
      if (place.openWeek && place.openAtWeek && place.closeAtWeek) {
        place.openToday = place.openWeek[day];
        place.openTomorrow = place.openWeek[tomorrow];

        place.openAt = place.openAtWeek[day];
        place.closeAt = place.closeAtWeek[day];
        // else, check as it was before, by openToday and openTomorrow
      } else if (
        place.openToday !== undefined &&
        place.openTomorrow !== undefined &&
        place.openToday !== place.openTomorrow
      ) {
        RollbarProvider.info(`Updating Place ${place.id} openToday from ${place.openToday} to ${place.openTomorrow}`);
        place.openToday = place.openTomorrow;
        await this.save(place, place.prefectureId);
      }
    }
  }

  /**
   * Update Open Today with Open Tomorrow field
   */
  public async openOrClosePlaces() {
    // console.log(minutesToCheck);
    if (!this._activeObserver) {
      await this.initPlaces();
    }
    const now = new Date();
    const placesToOpen = this.places.filter((p) => {
      const timeDiff = p.openAt ? minutesDiff(now, p.openAt.toDate()) : 0;
      // console.log(p.openAt && !p.open && p.openToday && timeDiff < minutesToCheck + 1 && timeDiff >= minutesToCheck);

      // Only open if opens today and still not open
      return p.openAt && !p.open && p.openToday && timeDiff === 1;
    });
    // console.log('Places to open', placesToOpen.length);

    const placesToClose = this.places.filter((p) => {
      //console.log(p.closeAt ? this.minutesDiff(p.closeAt.toDate(), now) : '');
      const timeDiff = p.closeAt ? minutesDiff(now, p.closeAt.toDate()) : 0;
      // Only closes if open
      return p.closeAt && p.open && timeDiff === 1;
    });

    for (const place of placesToOpen) {
      if (!place.id) continue;
      RollbarProvider.info(`Opening Place ${place.id}`);
      console.log(`👉 Opening Place ${place.id}`);
      place.open = true;
      place.queueStatus = 'open';
      //await this.save(place);
      await QueueUpdate.openOrClosePlace(place.prefectureId, place.id, true);
    }

    for (const place of placesToClose) {
      if (!place.id) continue;
      RollbarProvider.info(`Closing Place ${place.id}`);
      console.log(`👉 Closing Place ${place.id}`);
      place.open = false;
      place.queueStatus = 'closed';
      // await this.save(place);
      await QueueUpdate.openOrClosePlace(place.prefectureId, place.id, false);
    }
  }

  /**
   * Set back queueStatus to `open` when no updates for a long time
   */
  public async setBackQueueStatusOpen() {
    const minutesToCheck = Config.get('app.minutesRangeToCheck');
    if (this._activeObserver) {
      const now = new Date();
      const placesToSetBackToOpen = this.places.filter((p) => {
        if (!p.open || p.queueStatus === 'open' || !p.queueUpdatedAt) return;
        const timeDiff = Math.abs(minutesDiff(p.queueUpdatedAt.toDate(), now));
        console.log('p', p.title, p.queueStatus, p.queueUpdatedAt.toDate(), timeDiff); // console.log(p.openAt && !p.open && p.openToday && timeDiff < minutesToCheck + 1 && timeDiff >= minutesToCheck);
        // Only open if opens today and still not open
        return p.open && p.queueStatus !== 'open' && p.openToday && timeDiff >= minutesToCheck;
      });
      console.log('Places to set back to open', placesToSetBackToOpen.length);

      for (const place of placesToSetBackToOpen) {
        if (!place.id) continue;
        // RollbarProvider.info(`Setting back to queueStatus=open Place ${place.id}`);
        console.log(`👉 Setting back to queueStatus=open ${place.id}`);
        place.queueStatus = 'open';
        await this.save(place, place.prefectureId);
      }
    }
  }

  /**
   * Sanitize places json
   * @param placeJson
   * @returns
   */
  private async sanitizeJson(placeJson) {
    const place: any[] = [];
    for (const json of placeJson) {
      let result: { [k: string]: any } = {};
      const title = sanitizePlaceTitle(json.title);
      const internalTitle = json.internalTitle ? sanitizePlaceTitle(json.internalTitle) : getSlug(title);

      let type = json.type;
      if (!type || !['fixed', 'driveThru'].includes(json.type)) {
        console.log("Place type isn't fixed or driveThru... Defaulting to fixed");
        type = 'fixed';
      }
      const addressStreet = sanitizeAddress(json.addressStreet);
      const addressDistrict = sanitizeAddress(json.addressDistrict);
      const addressCityState = sanitizeAddress(json.addressCityState);

      const addressZip = sanitizeZip(json.addressZip);
      const googleMapsUrl = sanitizeString(json.googleMapsUrl);

      const active = json.active !== undefined ? parseBoolFromString(json.active) : true;

      const openAt = json.openAt ? DateTime.fromISO(json.openAt).toJSDate() : undefined;
      const closeAt = json.closeAt ? DateTime.fromISO(json.closeAt).toJSDate() : undefined;

      const open = openAt && closeAt ? IsNowBetweenTimes(openAt, closeAt) : false;
      const queueStatus = open ? 'open' : 'closed';
      const queueUpdatedAt = new Date();
      result = {
        title,
        internalTitle,
        type,
        open,
        queueStatus,
        queueUpdatedAt,
        active
      };

      if (addressStreet && addressStreet.length > 0) result.addressStreet = addressStreet;
      if (addressDistrict && addressDistrict.length > 0) result.addressDistrict = addressDistrict;
      if (addressCityState && addressCityState.length > 0) result.addressCityState = addressCityState;

      if (addressZip && addressZip.length > 0) result.addressZip = addressZip;
      if (googleMapsUrl && googleMapsUrl.length > 0) result.googleMapsUrl = googleMapsUrl;

      if (json.openToday !== undefined) result.openToday = parseBoolFromString(json.openToday);
      if (json.openTomorrow !== undefined) result.openTomorrow = parseBoolFromString(json.openTomorrow);

      if (openAt) result.openAt = openAt;
      if (closeAt) result.closeAt = closeAt;

      place.push(result);
    }
    return place;
  }

  /**
   * Receives Jsondata and insert in places
   * @param placesJson
   */
  public async importJsonData(placesJson: any[], prefectureId: string, deactivateMissing: boolean) {
    const prefectureDoc = await FirebaseProvider.db.collection('prefecture').doc(prefectureId).get();

    if (!prefectureDoc.exists) {
      console.log('Erro ao encontrar prefeitura informada.');
      throw new Error('Não foi possível encontrar a prefeitura informada.');
    }

    if (deactivateMissing) {
      // First deactivate every place, then defaults to true when present in file
      await FirebaseProvider.db
        .collectionGroup('place')
        .where('prefectureId', '==', prefectureId)
        .get()
        .then(async (docs) => {
          for (const place of docs.docs) {
            await place.ref.update({ active: false });
          }
        });
    }

    const places = await this.sanitizeJson(placesJson);
    console.log('Places from file ', places);

    // For each place...
    for (const place of places) {
      const slug = getSlug(place.title);
      // Ignore agenda for now
      delete place.agenda;

      await prefectureDoc.ref
        .collection('place')
        .doc(slug)
        .set(
          {
            ...place,
            prefectureId: prefectureId
          },
          { merge: true }
        );
    }
    console.log('Done importing places');
  }

  /**
   * Update queue status for demonstration city
   */
  public async updateQueueStatusForDemonstration(prefectureId: string) {
    if (!this._activeObserver) {
      await this.initPlaces();
    }

    const placesDemo = this.places.filter((p) => {
      return p.prefectureId === prefectureId && p.active && p.open;
    });
    const randomness = placesDemo.length === 1 ? 0.5 : 0.15;
    // console.log('randomness', randomness);
    let updated = 0;
    for (const place of placesDemo) {
      const prob = Math.random();
      // console.log('prob', prob);
      const minutesSinceLastUpdate = Math.abs(
        (place.queueUpdatedAt.toDate().getTime() - new Date().getTime()) / 60 / 1000
      );
      // console.log('minutesSinceLastUpdate', minutesSinceLastUpdate);
      // random update || keep updated
      if (place.id && (prob <= randomness || minutesSinceLastUpdate >= 45)) {
        await QueueUpdate.addRandomUpdate(place.prefectureId, place.id);
        updated++;
      }
      if (updated) console.log('Updated places: ', updated);
    }
  }

  /**
   * Update Open Today with Open Tomorrow field
   */
  public async findWithoutMapsUrl(prefectureId: string) {
    if (!this._activeObserver) {
      await this.initPlaces();
    }
    return this.places.filter(
      (p) => p.prefectureId === prefectureId && (!p.googleMapsUrl || p.googleMapsUrl.length === 0)
    );
  }

  /**
   * Collection path
   * @param documentIds
   * @returns Place collection path
   */
  public getCollectionPath(...documentIds: string[]): string {
    const id = documentIds.shift();
    if (!id) {
      throw new Error('Prefecture id is missing');
    }
    return `prefecture/${id}/place`;
  }
}

export default PlaceRepository.getInstance();

import { BaseRepository, BaseModel, ReadModel, Timestamp } from 'firestore-storage';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import { errorFactory } from 'App/Exceptions/ErrorFactory';
import QueueUpdate from 'App/Models/QueueUpdate';

import Cache from 'memory-cache';
import RollbarProvider from '@ioc:Adonis/Providers/Rollbar';
import Config from '@ioc:Adonis/Core/Config';

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
  queueUpdatedAt: Timestamp;
  openToday?: boolean;
  openTomorrow?: boolean;
  openAt?: Timestamp;
  closeAt?: Timestamp;

  latitude?: number;
  longitude?: number;
  distance?: number;
}

export class PlaceRepository extends BaseRepository<PlaceType> {
  private static instance: PlaceRepository;

  private places: PlaceType[];
  private _snapshotObserver: FirebaseFirestore.CollectionGroup;
  private _activeObserver: boolean = false;
  /**
   * Construtor
   */
  constructor() {
    super(FirebaseProvider.storage, errorFactory);
    console.log('INIT PLACES');
    this._snapshotObserver = FirebaseProvider.db.collectionGroup('place');
    this._snapshotObserver.onSnapshot(
      (docSnapshot) => {
        console.log(`Received doc snapshot place`);
        docSnapshot.docChanges().forEach((d) => {
          // deletar cache da prefeitura que mudou somente
          const cacheKeyPrefix = `prefecture-${d.doc.data().prefectureId}`;
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

    return documents;
  }

  /**
   * List active places
   * @returns Active places
   */
  public async listActive(prefectureId: string) {
    if (this._activeObserver) {
      return this.places
        .filter((place) => place.active && place.prefectureId === prefectureId)
        .sort((a, b) => {
          return (
            +b.open - +a.open ||
            +(b.openToday ? b.openToday : 0) - +(a.openToday ? a.openToday : 0) ||
            b.type.localeCompare(a.type) ||
            a.title.localeCompare(b.title)
          );
        });
    }
    return await this.query((qb) => {
      return qb
        .where('active', '==', true)
        .orderBy('open', 'desc')
        .orderBy('openToday', 'desc')
        .orderBy('type', 'desc')
        .orderBy('title', 'asc');
    }, prefectureId);
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
    if (this._activeObserver) {
      for (const place of this.places) {
        if (
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
  }

  /**
   * Update Open Today with Open Tomorrow field
   */
  public async openOrClosePlaces() {
    const minutesToCheck = Config.get('app.minutesRangeToCheck');
    // console.log(minutesToCheck);
    if (this._activeObserver) {
      const now = new Date();
      const placesToOpen = this.places.filter((p) => {
        const timeDiff = p.openAt ? minutesDiff(now, p.openAt.toDate()) : 0;
        // console.log(p.openAt && !p.open && p.openToday && timeDiff < minutesToCheck + 1 && timeDiff >= minutesToCheck);

        // Only open if opens today and still not open
        return p.openAt && !p.open && p.openToday && timeDiff < minutesToCheck + 1 && timeDiff >= minutesToCheck;
      });

      const placesToClose = this.places.filter((p) => {
        //console.log(p.closeAt ? this.minutesDiff(p.closeAt.toDate(), now) : '');
        const timeDiff = p.closeAt ? minutesDiff(now, p.closeAt.toDate()) : 0;
        // Only closes if not open
        return p.closeAt && p.open && timeDiff < minutesToCheck + 1 && timeDiff >= minutesToCheck;
      });

      for (const place of placesToOpen) {
        if (!place.id) continue;
        RollbarProvider.info(`Opening Place ${place.id}`);
        console.log(`Opening Place ${place.id}`);
        place.open = true;
        //await this.save(place);
        await QueueUpdate.openOrClosePlace(place.prefectureId, place.id, true);
      }

      for (const place of placesToClose) {
        if (!place.id) continue;
        RollbarProvider.info(`Closing Place ${place.id}`);
        console.log(`Closing Place ${place.id}`);
        place.open = false;
        // await this.save(place);
        await QueueUpdate.openOrClosePlace(place.prefectureId, place.id, false);
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

      if (json.openToday !== undefined) result.openToday = json.openToday;
      if (json.openTomorrow !== undefined) result.openTomorrow = json.openTomorrow;

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
      await this._snapshotObserver
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
    if (this._activeObserver) {
      const placesDemo = this.places.filter((p) => {
        return p.prefectureId === prefectureId && p.active && p.open;
      });
      const randomness = placesDemo.length === 1 ? 0.5 : 0.2;
      console.log('randomness', randomness);
      for (const place of placesDemo) {
        const prob = Math.random();
        console.log('prob', prob);
        const minutesSinceLastUpdate = Math.abs(
          (place.queueUpdatedAt.toDate().getTime() - new Date().getTime()) / 60 / 1000
        );
        console.log('minutesSinceLastUpdate', minutesSinceLastUpdate);
        // random update || keep updated
        if (place.id && (prob <= randomness || minutesSinceLastUpdate >= 45)) {
          await QueueUpdate.addRandomUpdate(place.prefectureId, place.id);
        }
      }
    }
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

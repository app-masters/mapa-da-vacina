import { BaseRepository, BaseModel, ReadModel, Timestamp } from 'firestore-storage';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import { errorFactory } from 'App/Exceptions/ErrorFactory';
import QueueUpdate from 'App/Models/QueueUpdate';

import Cache from 'memory-cache';
import RollbarProvider from '@ioc:Adonis/Providers/Rollbar';
import { minutesDiff } from 'App/Helpers';

export interface PlaceType extends BaseModel {
  prefectureId: string;
  title: string;
  internalTitle: string;
  addressStreet: string;
  addressDistrict: string;
  addressCityState: string;
  addressZip: string;
  googleMapsUrl: string;
  type: string;
  active: boolean;
  open: boolean;
  queueStatus: string;
  queueUpdatedAt: Date;
  openToday?: boolean;
  openTomorrow?: boolean;
  openAt?: Timestamp;
  closeAt?: Timestamp;
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
        this._activeObserver = true;
        this.places = docSnapshot.docs.map((d) => {
          // deletar cache da prefeitura id
          const cacheKey = `prefecture-${d.data().prefectureId}`;
          // console.log('Deleting cache: ', cacheKey);
          Cache.del(cacheKey);
          return {
            ...this.getObjectFromData(d.data()),
            id: d.id,
            createdAt: d.createTime.toDate(),
            updatedAt: d.updateTime.toDate()
          } as PlaceType;
        });
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
   * List active prefectures
   * @returns Active prefectures
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
    if (this._activeObserver) {
      const now = new Date();
      const placesToOpen = this.places.filter((p) => {
        //console.log(p.openAt ? this.minutesDiff(p.openAt.toDate(), now) : '');
        const timeDiff = p.openAt ? minutesDiff(p.openAt.toDate(), now) : 0;
        // Only open if opens today and still not open
        return p.openAt && !p.open && p.openToday && timeDiff <= -1 && timeDiff > -2;
      });

      const placesToClose = this.places.filter((p) => {
        //console.log(p.closeAt ? this.minutesDiff(p.closeAt.toDate(), now) : '');
        const timeDiff = p.closeAt ? minutesDiff(p.closeAt.toDate(), now) : 0;
        // Only closes if not open
        return p.closeAt && p.open && timeDiff <= -1 && timeDiff > -2;
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

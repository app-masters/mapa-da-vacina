import { BaseRepository, BaseModel, ReadModel } from 'firestore-storage';
import { errorFactory } from 'App/Exceptions/ErrorFactory';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import PlaceRepository, { PlaceType } from './Place';

import Cache from 'memory-cache';
import Place from './Place';
import { deleteCacheByPrefix } from 'App/Helpers';

export interface PrefectureType extends BaseModel {
  name: string;
  slug: string;
  city: string;
  state: string;
  numPlaces: number;
  numPlacesOpen: number;
  active: boolean;
  showQueueUpdatedAt?: boolean;
}

class PrefectureRepository extends BaseRepository<PrefectureType> {
  private static instance: PrefectureRepository;
  private static collections = ['place', 'user'];

  private prefectures: PrefectureType[];
  private _snapshotObserver;
  private _activeObserver: boolean = false;
  /**
   * Construtor
   */
  constructor() {
    super(FirebaseProvider.storage, errorFactory);
    console.log('INIT PREFECTURE');
    this._snapshotObserver = FirebaseProvider.db.collection('prefecture').onSnapshot(
      (docSnapshot) => {
        console.log(`Received doc snapshot user`);
        console.log('Deleting cache: ', 'prefectures-list');
        Cache.del('prefectures-list');
        docSnapshot.docChanges().forEach((d) => {
          // deletar cache da prefeitura que mudou somente
          const cacheKeyPrefix = `prefecture:${d.doc.id}-`;
          // console.log('Deleting cache: ', cacheKey);
          deleteCacheByPrefix(cacheKeyPrefix);
        });
        this.prefectures = docSnapshot.docs.map((d) => {
          return {
            ...this.getObjectFromData(d.data()),
            id: d.id,
            createdAt: d.createTime.toDate(),
            updatedAt: d.updateTime.toDate()
          } as PrefectureType;
        });
        this._activeObserver = true;
      },
      (err) => {
        this._activeObserver = false;
        console.error(`Encountered error: ${err}`);
      }
    );
  }

  /**
   * Init prefectures
   */
  public async initPrefectures() {
    if (!this._activeObserver) {
      const docSnapshot = await FirebaseProvider.db.collection('prefecture').get();
      this.prefectures = docSnapshot.docs.map((d) => {
        return {
          ...this.getObjectFromData(d.data()),
          id: d.id,
          createdAt: d.createTime.toDate(),
          updatedAt: d.updateTime.toDate()
        } as PrefectureType;
      });
    }
  }
  /**
   * Get Object from Firestore DocumentData
   * @param data DocumentData
   * @returns PrefectureType
   */
  private getObjectFromData(data: FirebaseFirestore.DocumentData) {
    return data as PrefectureType;
  }

  /**
   * getInstance
   */
  public static getInstance() {
    if (!PrefectureRepository.instance) {
      PrefectureRepository.instance = new PrefectureRepository();
    }
    return PrefectureRepository.instance;
  }

  /**
   * findByIdWithSubcolletions
   * @param id
   * @returns
   */
  public async findByIdWithPlaces(id: string) {
    interface ExtendedPrefecture extends PrefectureType {
      places?: PlaceType[];
    }
    const prefecture: ExtendedPrefecture | null = await this.findById(id);
    if (!prefecture) throw new Error("Couldn't find Prefecture with id: " + id);

    const places = await PlaceRepository.findByPrefectureWithCurrentAgenda(id);
    console.log('places findByIdWithPlaces ', places.length);

    return { ...prefecture, places: places };
  }

  /**
   * Try to get value via snapshot. If it doesn't exist yet, query firestore
   * @param ids
   * @returns
   */
  public async findById(prefectureId: string): Promise<ReadModel<PrefectureType> | null> {
    if (this._activeObserver) {
      return this.prefectures.filter((pref) => pref.id === prefectureId)[0] as ReadModel<PrefectureType>;
    }

    return await super.findById(prefectureId);
  }

  /**
   * List prefectures
   * @returns Prefectures
   */
  public async list() {
    if (this._activeObserver) {
      return this.prefectures as ReadModel<PrefectureType>[];
    }
    return await super.list();
  }

  /**
   * List active prefectures
   * @returns Active prefectures
   */
  public async listActive() {
    let documents;
    if (this._activeObserver) {
      documents = this.prefectures.filter((pref) => pref.active);
    } else {
      documents = await this.query((qb) => {
        return qb.where('active', '==', true);
      });
    }

    return documents.sort((p1, p2) => p1.city.localeCompare(p2.city));
  }

  /**
   * Update queue status for demonstration city
   */
  public async updatePlacesForDemonstration() {
    if (!this._activeObserver) {
      await this.initPrefectures();
    }
    if (this._activeObserver) {
      const prefDemonstration = this.prefectures.filter(
        (p) => p.name.includes('Demonstração') || p.city.includes('Demonstração')
      );
      // console.log('prefDemonstration', prefDemonstration);
      if (!(prefDemonstration.length > 0) || !prefDemonstration[0].id) {
        console.log("Couldn't find prefecture for Demonstração");
        return;
      }
      await Place.updateQueueStatusForDemonstration(prefDemonstration[0].id);
    }
  }

  /**
   * Get collection path
   * @returns Collection path string
   */
  public getCollectionPath(): string {
    return 'prefecture';
  }

  /**
   * Tell if we have _activeObserver (local data)
   */
  public hasActiveObserver(): boolean {
    return this._activeObserver;
  }
}

export default PrefectureRepository.getInstance();

import { BaseRepository, BaseModel, ReadModel } from 'firestore-storage';
import { errorFactory } from 'App/Exceptions/ErrorFactory';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import PlaceRepository, { PlaceType } from './Place';

export interface PrefectureType extends BaseModel {
  name: string;
  slug: string;
  city: string;
  state: string;
  numPlaces: number;
  numPlacesOpen: number;
  active: boolean;
  places?: PlaceType[];
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
        this._activeObserver = true;
        this.prefectures = docSnapshot.docs.map((d) => {
          return {
            ...this.getObjectFromData(d.data()),
            id: d.id,
            createdAt: d.createTime.toDate(),
            updatedAt: d.updateTime.toDate()
          } as PrefectureType;
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
  public async findByIdWithPlacesAndUsers(id: string) {
    const document = await this.findById(id);
    if (!document) throw new Error("Couldn't find Prefecture with id: " + id);

    let places: PlaceType[] = [];
    for (const collection of PrefectureRepository.collections) {
      console.log('Found subcollection: ', collection);
      if (collection === 'place') {
        places = await PlaceRepository.findByPrefectureWithCurrentAgenda(id);
      }
      if (collection === 'user') {
        // get users
      }
    }
    document.places = places;
    return document;
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
    return await this.list();
  }

  /**
   * List active prefectures
   * @returns Active prefectures
   */
  public async listActive() {
    if (this._activeObserver) {
      console.log('Via observer prefecture');
      return this.prefectures.filter((pref) => pref.active).sort((p1, p2) => p1.city.localeCompare(p2.city));
    }
    console.log('Via query prefecture');
    return await this.query((qb) => {
      return qb.where('active', '==', true).orderBy('city', 'asc');
    });
  }

  /**
   * Get collection path
   * @returns Collection path string
   */
  public getCollectionPath(): string {
    return 'prefecture';
  }
}

export default PrefectureRepository.getInstance();

import { BaseRepository, BaseModel } from 'firestore-storage';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import { errorFactory } from 'App/Exceptions/ErrorFactory';
import AgendaRepository, { AgendaType } from './Agenda';

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
  agendas?: AgendaType[];
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
        this._activeObserver = true;
        this.places = docSnapshot.docs.map((d) => {
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
   * findByIdWithSubcolletions
   * @param id
   * @returns
   */
  public async findByPrefectureWithCurrentAgenda(prefId: string): Promise<PlaceType[]> {
    const documents = await this.listActive(prefId); // list({ active: true }, prefId);

    for (const document of documents) {
      if (!document.id) return [];
      document.agendas = await AgendaRepository.listAgendaTodayAndTomorrow(prefId, document.id);
    }

    return documents;
  }

  /**
   * List active prefectures
   * @returns Active prefectures
   */
  public async listActive(prefectureId: string) {
    console.log(this._activeObserver);

    if (this._activeObserver) {
      console.log('Via observer places');
      return this.places
        .filter((place) => place.active && place.prefectureId === prefectureId)
        .sort((place) => {
          return place.active ? -1 : 1; // `true` values first
        });
    }
    console.log('Via query places');
    return await this.list({ active: true }, prefectureId);
  }

  /**
   * Colection path
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

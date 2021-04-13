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
  open: boolean;
  queueStatus: string;
  queueUpdatedAt: Date;
  agendas?: AgendaType[];
}

export class PlaceRepository extends BaseRepository<PlaceType> {
  private static instance: PlaceRepository;
  public places: PlaceType[];

  /**
   * Constructor
   */
  constructor() {
    console.log('INIT PLACES');
    super(FirebaseProvider.storage, errorFactory);
    /*FirebaseProvider.db.collectionGroup('place').onSnapshot(
      (docSnapshot) => {
        console.log(`Received doc snapshot`);
        console.log(docSnapshot.docChanges().map((d) => d.doc.data() as PlaceType));
        this.places = docSnapshot.docs.map((d) => d.data() as PlaceType);
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    );*/
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
    const documents = await this.list({}, prefId);

    for (const document of documents) {
      document.agendas = await AgendaRepository.listAgendaTodayAndTomorrow(prefId, document.id);
    }

    return documents;
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

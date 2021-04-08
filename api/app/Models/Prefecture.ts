import { BaseRepository, BaseModel, ReadModel } from 'firestore-storage';
import { errorFactory } from 'App/Exceptions/ErrorFactory';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import PlaceRepository, { PlaceType } from './Place';

export interface PrefectureType extends BaseModel {
  name: string;
  slug: string;
  places?: PlaceType[];
}

class PrefectureRepository extends BaseRepository<PrefectureType> {
  private static instance: PrefectureRepository;
  //public prefectures: PrefectureType[];

  /**
   * Construtor
   */
  constructor() {
    console.log('INIT');

    super(FirebaseProvider.storage, errorFactory);
    /*FirebaseProvider.db.collection('prefecture').onSnapshot(
      (docSnapshot) => {
        console.log(`Received doc snapshot`);
        this.prefectures = docSnapshot.docs.map((d) => d.data() as PrefectureType);
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
    const document = await this.getById(id);

    const collections = await FirebaseProvider.db.collection(this.getCollectionPath()).doc(id).listCollections();
    let places: PlaceType[] = [];
    for (const collection of collections) {
      console.log('Found subcollection with id:', collection.id);
      if (collection.id === 'place') {
        places = await PlaceRepository.findByPrefectureWithCurrentAgenda(id);
      }
    }
    document.places = places;
    return document;
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

import { BaseRepository, BaseModel } from 'firestore-storage';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import { errorFactory } from 'App/Exceptions/ErrorFactory';

export interface QueueUpdateType extends BaseModel {
  userId: string;
  queueStatus: string;
  queueUpdatedAt: Date;
}

export class QueueUpdateRepository extends BaseRepository<QueueUpdateType> {
  private static instance: QueueUpdateRepository;
  /**
   * Constructor
   */
  constructor() {
    super(FirebaseProvider.storage, errorFactory);
  }

  /**
   * getInstance
   */
  public static getInstance() {
    if (!QueueUpdateRepository.instance) {
      QueueUpdateRepository.instance = new QueueUpdateRepository();
    }
    return QueueUpdateRepository.instance;
  }

  /**
   * Colection path
   * @param documentIds
   * @returns QueueUpdate collection path
   */
  public getCollectionPath(...documentIds: string[]): string {
    const idPrefecture = documentIds.shift();
    if (!idPrefecture) {
      throw new Error('Prefecture id is missing');
    }
    const idPlace = documentIds.shift();
    if (!idPlace) {
      throw new Error('Prefecture id is missing');
    }

    return `prefecture/${idPrefecture}/place/${idPlace}/queue-update`;
  }
}

export default QueueUpdateRepository.getInstance();

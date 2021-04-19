import { BaseRepository, BaseModel } from 'firestore-storage';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import { errorFactory } from 'App/Exceptions/ErrorFactory';

export interface QueueUpdateType extends BaseModel {
  userId: string;
  placeId: string;
  open: boolean;
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
   * Add an Place Update
   * @param placeId
   * @param open
   */
  public async openOrClosePlace(prefectureId: string, placeId: string, open: boolean) {
    await this.save(
      {
        userId: 'cronjob',
        placeId: placeId,
        open: open,
        queueStatus: open ? 'open' : 'closed',
        queueUpdatedAt: new Date()
      },
      prefectureId,
      placeId
    );
  }

  /**
   * Add random update to queue
   * @param prefectureId
   * @param placeId
   */
  public async addRandomUpdate(prefectureId: string, placeId: string) {
    const status = ['noQueue', 'smallQueue', 'mediumQueue', 'longQueue'];
    console.log('Update placeId: ' + placeId);
    await this.save(
      {
        userId: 'cronjob',
        placeId: placeId,
        open: true,
        queueStatus: status[Math.floor(Math.random() * status.length)],
        queueUpdatedAt: new Date()
      },
      prefectureId,
      placeId
    );
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

    return `prefecture/${idPrefecture}/place/${idPlace}/queueUpdate`;
  }
}

export default QueueUpdateRepository.getInstance();

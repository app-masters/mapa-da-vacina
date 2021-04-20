import Config from '@ioc:Adonis/Core/Config';
import { BaseRepository, BaseModel, Timestamp, isTimestamp } from 'firestore-storage';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import { errorFactory } from 'App/Exceptions/ErrorFactory';
import { QueueUpdateConstraint, QueueUpdateIndexes, QueueUpdateValues } from './Constraints';

export interface QueueUpdateType extends BaseModel {
  userId: string;
  placeId: string;
  open: boolean;
  queueStatus: string;
  queueUpdatedAt: Date;
}

export class QueueUpdateRepository extends BaseRepository<QueueUpdateType> {
  private static instance: QueueUpdateRepository;

  private queueUpdates: QueueUpdateType[];
  private _snapshotObserver;
  private _activeObserver: boolean = false;

  /**
   * Constructor
   */
  constructor() {
    super(FirebaseProvider.storage, errorFactory);

    this._snapshotObserver = FirebaseProvider.db.collectionGroup('queueUpdate').onSnapshot(
      (docSnapshot) => {
        console.log(`Received doc snapshot queueUpdate`);

        this.queueUpdates = docSnapshot.docs.map((d) => {
          return {
            ...this.getObjectFromData(d.data()),
            queueUpdatedAt: isTimestamp(d.data().queueUpdatedAt)
              ? d.data().queueUpdatedAt.toDate()
              : d.data().queueUpdatedAt,
            id: d.id,
            createdAt: d.createTime.toDate(),
            updatedAt: d.updateTime.toDate()
          } as QueueUpdateType;
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
   * init
   */
  public async init() {
    if (!this._activeObserver) {
      const docSnapshot = await FirebaseProvider.db.collectionGroup('queueUpdate').get();
      this.queueUpdates = docSnapshot.docs.map((d) => {
        return {
          ...this.getObjectFromData(d.data()),
          queueUpdatedAt: isTimestamp(d.data().queueUpdatedAt)
            ? d.data().queueUpdatedAt.toDate()
            : d.data().queueUpdatedAt,
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
   * @returns PrefectureType
   */
  private getObjectFromData(data: FirebaseFirestore.DocumentData) {
    return data as QueueUpdateType;
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
   * Math to calculate mean status
   * @param status
   * @returns
   */
  public getMeanStatus(status: string[]) {
    const sum = status
      .map((s) => QueueUpdateValues[s])
      .reduce((acc, val) => {
        return acc + val;
      }, 0);
    console.log(Math.round(sum / status.length), sum, status.length);
    return Math.round(sum / status.length);
  }

  /**
   * Calculate mean queue update and insert into table
   * @param prefectureId
   * @param placeId
   * @param status
   * @param ip
   */
  public async insertMeanQueueUpdate(prefectureId: string, placeId: string, status: string, ip: string) {
    if (!this._activeObserver) await this.init();

    const meanRange = Config.get('app.queueStatusMeanInterval');
    const minutesAgo = new Date(Date.now() - 1000 * 60 * meanRange);
    // get latest for place, discarding open and closed
    const latestUpdates = this.queueUpdates
      .filter(
        (qu) =>
          qu.placeId === placeId &&
          qu.queueUpdatedAt >= minutesAgo &&
          qu.queueStatus !== QueueUpdateConstraint.open &&
          qu.queueStatus !== QueueUpdateConstraint.closed
      )
      .map((qu) => qu.queueStatus);

    const meanStatusIndex = this.getMeanStatus([...latestUpdates, status]);
    const newStatus = {
      userId: ip,
      placeId: placeId,
      open: true,
      queueStatus: QueueUpdateIndexes[meanStatusIndex],
      queueUpdatedAt: new Date()
    };
    await this.save(newStatus, prefectureId, placeId);
    return newStatus;
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

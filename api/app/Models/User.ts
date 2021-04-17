import { BaseRepository, BaseModel, ReadModel } from 'firestore-storage';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import { errorFactory } from 'App/Exceptions/ErrorFactory';

export interface UserType extends BaseModel {
  phone: string;
  role: string;
  name: string;
  active?: boolean;
  prefectureId: string;
  invitedAt?: Date;
  signedUpAt?: Date;
  placeId?: string;
  uid?: string;
}

class UserRepository extends BaseRepository<UserType> {
  private static instance: UserRepository;

  private users: UserType[];
  private _snapshotObserver;
  private _activeObserver: boolean = false;
  /**
   * Construtor
   */
  constructor() {
    super(FirebaseProvider.storage, errorFactory);
    console.log('INIT USER');
    this._snapshotObserver = FirebaseProvider.db.collectionGroup('user').onSnapshot(
      (docSnapshot) => {
        console.log(`Received doc snapshot user`);
        this._activeObserver = true;
        this.users = docSnapshot.docs.map((d) => {
          return {
            ...this.getObjectFromData(d.data()),
            id: d.id,
            createdAt: d.createTime.toDate(),
            updatedAt: d.updateTime.toDate()
          } as UserType;
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
    return data as UserType;
  }

  /**
   * getInstance
   */
  public static getInstance() {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  /**
   * Try to get value via snapshot. If it doesn't exist yet, query firestore
   * @param ids
   * @returns
   */
  public async findById(userId: string, prefectureId: string): Promise<ReadModel<UserType> | null> {
    if (this._activeObserver) {
      return this.users.filter((u) => u.id === userId && u.prefectureId === prefectureId)[0] as ReadModel<UserType>;
    }
    return await super.findById(prefectureId, userId);
  }

  /**
   * Try to get value via snapshot. If it doesn't exist yet, query firestore
   * @param ids
   * @returns
   */
  public async findByPhone(phone: string, prefectureId: string): Promise<ReadModel<UserType> | null> {
    if (this._activeObserver) {
      return this.users.filter((u) => u.phone === phone && u.prefectureId === prefectureId)[0] as ReadModel<UserType>;
    }
    return await super.find({ phone: phone }, prefectureId);
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
    return `prefecture/${id}/user`;
  }
}

export default UserRepository.getInstance();

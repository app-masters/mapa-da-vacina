import { BaseRepository, BaseModel, ReadModel } from 'firestore-storage';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import { errorFactory } from 'App/Exceptions/ErrorFactory';

export interface AdminType extends BaseModel {
  phone: string;
  role: string;
  name: string;
  uid?: string;
}

class AdminRepository extends BaseRepository<AdminType> {
  private static instance: AdminRepository;

  private admins: AdminType[];
  private _snapshotObserver;
  private _activeObserver: boolean = false;
  /**
   * Construtor
   */
  constructor() {
    super(FirebaseProvider.storage, errorFactory);
    console.log('INIT ADMIN');
    this._snapshotObserver = FirebaseProvider.db.collection('prefecture').onSnapshot(
      (docSnapshot) => {
        console.log(`Received doc snapshot user`);
        this._activeObserver = true;
        this.admins = docSnapshot.docs.map((d) => {
          return {
            ...this.getObjectFromData(d.data()),
            id: d.id,
            createdAt: d.createTime.toDate(),
            updatedAt: d.updateTime.toDate()
          } as AdminType;
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
    return data as AdminType;
  }

  /**
   * getInstance
   */
  public static getInstance() {
    if (!AdminRepository.instance) {
      AdminRepository.instance = new AdminRepository();
    }
    return AdminRepository.instance;
  }

  /**
   * Try to get value via snapshot. If it doesn't exist yet, query firestore
   * @param ids
   * @returns
   */
  public async findById(adminId: string): Promise<ReadModel<AdminType> | null> {
    if (this._activeObserver) {
      return this.admins.filter((adm) => adm.id === adminId)[0] as ReadModel<AdminType>;
    }
    return await super.findById(adminId);
  }

  /**
   * Try to get value via snapshot. If it doesn't exist yet, query firestore
   * @param ids
   * @returns
   */
  public async findByPhone(phone: string): Promise<ReadModel<AdminType> | null> {
    if (this._activeObserver) {
      return this.admins.filter((u) => u.phone === phone)[0] as ReadModel<AdminType>;
    }
    return await super.find({ phone: phone });
  }

  /**
   * Colection path
   * @param documentIds
   * @returns Place collection path
   */
  public getCollectionPath(): string {
    return `admin`;
  }
}

export default AdminRepository.getInstance();

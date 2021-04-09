import { BaseRepository, BaseModel } from 'firestore-storage';
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

  /**
   * Constructor
   */
  constructor() {
    console.log('INIT ADMIN');
    super(FirebaseProvider.storage, errorFactory);
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
   * Colection path
   * @param documentIds
   * @returns Place collection path
   */
  public getCollectionPath(): string {
    return `admin`;
  }
}

export default AdminRepository.getInstance();

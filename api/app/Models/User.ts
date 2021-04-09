import { BaseRepository, BaseModel } from 'firestore-storage';
import FirebaseProvider from '@ioc:Adonis/Providers/Firebase';
import { errorFactory } from 'App/Exceptions/ErrorFactory';

export interface UserType extends BaseModel {
  phone: string;
  role: string;
  name: string;
  invitedAt?: Date;
  signedUpAt?: Date;
  active: boolean;
  placeId?: string;
  prefectureId?: string;
}

class UserRepository extends BaseRepository<UserType> {
  private static instance: UserRepository;

  /**
   * Constructor
   */
  constructor() {
    console.log('INIT USERS');
    super(FirebaseProvider.storage, errorFactory);
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

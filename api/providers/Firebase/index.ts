import { ConfigContract } from '@ioc:Adonis/Core/Config';
import { FirebaseInterface } from '@ioc:Adonis/Providers/Firebase';

import firebase from 'firebase-admin';
import { FirestoreStorage } from 'firestore-storage';

export default class Firebase implements FirebaseInterface {
  public app: firebase.app.App;
  public db: firebase.firestore.Firestore;
  public admin: typeof firebase;
  public storage: FirestoreStorage;
  /**
   * Constructor
   * @param Config
   */
  constructor(Config: ConfigContract) {
    // Get config
    const googleCredentials = Config.get('firebase.credential');
    const databaseURL = Config.get('firebase.databaseURL');

    if (googleCredentials && databaseURL) {
      this.app = firebase.initializeApp({
        credential: googleCredentials.startsWith('{')
          ? firebase.credential.cert(JSON.parse(googleCredentials))
          : firebase.credential.applicationDefault(),
        databaseURL: databaseURL
      });
      this.db = this.app.firestore();
      this.storage = new FirestoreStorage(this.db);
    } else {
      console.log('Undefined Google Credentials');
    }
  }
}

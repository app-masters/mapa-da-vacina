declare module '@ioc:Adonis/Providers/Firebase' {
  import * as firebase from 'firebase-admin';
  import { FirestoreStorage } from 'firestore-storage';

  export interface FirebaseInterface {
    app: firebase.app.App;
    db: firebase.firestore.Firestore;
    storage: FirestoreStorage;
  }

  const FirebaseProvider: FirebaseInterface;
  export default FirebaseProvider;
}

declare module '@ioc:Adonis/Providers/Firebase' {
  import * as firebase from 'firebase-admin';

  export interface FirebaseConfig {
    credential: string;
    databaseURL: string;
  }

  export interface FirebaseInterface {
    app: firebase.app.App;
    db: firebase.firestore.Firestore;
  }

  const FirebaseProvider: FirebaseInterface;
  export default FirebaseProvider;
}

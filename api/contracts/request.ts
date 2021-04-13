declare module '@ioc:Adonis/Core/Request' {
  import { auth } from 'firebase-admin';

  interface RequestContract {
    decodedIdToken?: auth.DecodedIdToken;
  }
}

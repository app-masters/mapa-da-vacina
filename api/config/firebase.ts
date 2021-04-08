import Env from '@ioc:Adonis/Core/Env';

interface FirebaseConfig {
  credential: string;
  databaseURL: string;
}

const firebaseConfig: FirebaseConfig = {
  credential: Env.get('GOOGLE_APPLICATION_CREDENTIALS') as string,
  databaseURL: Env.get('GOOGLE_DATABASE_URL') as string
};

export default firebaseConfig;

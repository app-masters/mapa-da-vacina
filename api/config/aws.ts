import Env from '@ioc:Adonis/Core/Env';

interface AwsConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  devPhone: string;
}

const firebaseConfig: AwsConfig = {
  accessKeyId: Env.get('AWS_ACCESS_KEY') as string,
  secretAccessKey: Env.get('AWS_SECRET_ACCESS_KEY') as string,
  region: Env.get('AWS_REGION') as string,
  devPhone: Env.get('AWS_DEV_PHONE') as string
};

export default firebaseConfig;

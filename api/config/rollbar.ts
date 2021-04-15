import Env from '@ioc:Adonis/Core/Env';

interface RollbarConfig {
  serverToken: string;
}

const rollbarConfig: RollbarConfig = {
  serverToken: Env.get('ROLLBAR_SERVER_TOKEN') as string
};

export default rollbarConfig;

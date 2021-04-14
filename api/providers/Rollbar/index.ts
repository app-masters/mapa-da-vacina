import { ConfigContract } from '@ioc:Adonis/Core/Config';

import rollbar from 'rollbar';

export default class Rollbar {
  /**
   * Rollbar service constructor (happen once at runtime)
   */
  constructor(Config: ConfigContract) {
    // Get config
    const serverToken = Config.get('rollbar.serverToken');
    const nodeEnv = Config.get('app.nodeEnv');

    // Create rollbar config
    const config = {
      accessToken: serverToken,
      environment: `api.${nodeEnv}`,
      captureUncaught: true,
      captureUnhandledRejections: true,
      payload: {
        client: {
          javascript: {
            // eslint-disable-next-line camelcase
            source_map_enabled: true,
            // eslint-disable-next-line camelcase
            guess_uncaught_frames: true
          }
        }
      }
    };
    // Create rollbar instance
    return new rollbar(config);
  }
}

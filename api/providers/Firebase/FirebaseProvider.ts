import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import Firebase from '.';

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
*/
export default class FirebaseProvider {
  public static needsApplication = true;
  /**
   * Constructor
   * @param application
   */
  constructor(protected application: ApplicationContract) {}
  /**
   * Register
   */
  public register() {
    // Register your own bindings

    this.application.container.singleton('Adonis/Providers/Firebase', () => {
      const Config = this.application.config;
      return new Firebase(Config);
    });
  }
  /**
   * Boot
   */
  public async boot() {
    // All bindings are ready, feel free to use them
  }
  /**
   * Ready
   */
  public async ready() {
    // App is ready
  }
  /**
   * Shutdown
   */
  public async shutdown() {
    // Cleanup, since app is going down
  }
}

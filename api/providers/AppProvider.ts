import { ApplicationContract } from '@ioc:Adonis/Core/Application';

export default class AppProvider {
  public static needsApplication = true;
  /**
   * AppProvider constructor
   * @param app
   */
  constructor(protected app: ApplicationContract) {}

  /**
   * Register
   */
  public register() {
    // Register your own bindings
  }

  /**
   * Boot
   */
  public async boot() {
    // IoC container is ready
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

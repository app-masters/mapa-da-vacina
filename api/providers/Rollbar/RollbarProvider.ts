import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import Rollbar from '.';
/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = (await import('@ioc:Adonis/Lucid/Database')).default
|   const Event = (await import('@ioc:Adonis/Core/Event')).default
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class RollbarProvider {
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
    this.application.container.singleton('Adonis/Providers/Rollbar', () => {
      const Config = this.application.config;
      return new Rollbar(Config);
    });
  }
}

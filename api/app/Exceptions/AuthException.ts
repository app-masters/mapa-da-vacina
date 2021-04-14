import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler';
import RollbarProvider from '@ioc:Adonis/Providers/Rollbar';
import Logger from '@ioc:Adonis/Core/Logger';

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new AuthException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class AuthException extends HttpExceptionHandler {
  /**
   * Constructor
   * @param message Error message
   * @param status Status code
   * @returns
   */
  constructor(message: string, status: number) {
    super(Logger);
    if (!message || !status) {
      throw new Error('Cannot invoke AuthException without message and status');
    }

    return this;
  }

  /**
   * Log AuthError to Rollbar
   * @param error
   * @param ctx
   */
  public async report(error, ctx) {
    // Using rollbar instead of application logger
    RollbarProvider.info(error);
  }
}

/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger';
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler';
import RollbarProvider from '@ioc:Adonis/Providers/Rollbar';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class ExceptionHandler extends HttpExceptionHandler {
  protected ignoreCodes = ['E_ROUTE_NOT_FOUND', 'E_VALIDATION_FAILURE'];

  protected ignoreStatuses = [400, 422, 401, 404];

  /**
   * ExceptionHandler constructor
   */
  constructor() {
    super(Logger);
  }
  /**
   * Handle
   * @param error
   * @param ctx
   * @returns
   */
  public async handle(error, ctx) {
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).send(error.messages);
    }
    // console.log('Handling error ', error);
    return super.handle(error, ctx);
  }

  /**
   * Report
   * @param error
   * @param ctx
   */
  public async report(error: any, ctx: HttpContextContract) {
    // Using rollbar instead of application logger
    // console.log('Reporting error ', error);
    RollbarProvider.error(error);
  }
}

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UserValidator from 'App/Validators/UserValidator';

export default class UsersController {
  /**
   * Invite a new user
   */
  public async invite({ request, response }: HttpContextContract) {
    const data = await request.validate(UserValidator);
  }
}

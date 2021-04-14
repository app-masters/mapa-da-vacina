import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Mail from '@ioc:Adonis/Addons/Mail';

// Validators
import ContactValidator from 'App/Validators/ContactValidator';

export default class ContactsController {
  public async sendContact({ request, response, params }: HttpContextContract) {
    const data = await request.validate(ContactValidator);
  }
}

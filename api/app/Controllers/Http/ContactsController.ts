import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Mail from '@ioc:Adonis/Addons/Mail';
import Config from '@ioc:Adonis/Core/Config';

// Validators
import ContactValidator from 'App/Validators/ContactValidator';

export default class ContactsController {
  /**
   * Send contact Email
   * @param param0
   * @returns
   */
  public async sendContact({ request, response, params }: HttpContextContract) {
    const data = await request.validate(ContactValidator);
    console.log(data);
    const contactEmail = Config.get('app.contactEmail');
    console.log(contactEmail);

    const { url } = await Mail.preview((message) => {
      message.from(data.email).to(contactEmail).subject(data.subject).text(`<p>${data.name}</p><p>${data.content}</p>`);
    });

    console.log(`Preview url: ${url}`);
    return response.status(200).send({ status: 200 });
  }
}

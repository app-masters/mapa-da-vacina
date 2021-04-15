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

    await Mail.send((message) => {
      message.from(data.email).to(contactEmail).subject('Nova Prefeitura - Mapa da Vacina').html(
        `
        <h2>Novo pedido de inclusão de prefeitura</h2>
        <ul>
          <li><b>Nome:</b> ${data.name}</li>
          <li><b>Cidade:</b> ${data.city}</li>
          <li><b>Estado:</b> ${data.state}</li>
          <li><b>Relação com a prefeitura:</b> ${data.prefectureRelation}</li>
          <li><b>Email:</b> ${data.email}</li>
          <li><b>Telefone:</b> ${data.phone}
            <span> &bull; <span>
            <a href="tel:${data.phone}"><b>Ligar</b></a>
            <span> &bull; <span>
            <a href="https://api.whatsapp.com/send/?phone=${data.phone}"><b>Whatsapp</b></a>
          </li>
        </ul>
        `
      );
    });

    return response.status(200).send({ status: 200 });
  }
}

import AwsProvider from '@ioc:Adonis/Providers/Aws';
import { UserType } from 'App/Models/User';
import Config from '@ioc:Adonis/Core/Config';

export default class SmsMessages {
  /**
   * Send invite Sms to user
   * @param {User} user
   */
  public static async sendInviteSms(user: UserType, city?: string | undefined, placeTitle?: string | undefined) {
    const userFunction = {
      superAdmin: 'administrar o sistema Mapa da Vacina',
      prefectureAdmin: `administrar a prefeitura de ${city} no Mapa da Vacina`,
      placeAdmin: `administrar ${placeTitle} no Mapa da Vacina`,
      queueObserver: 'atualizar a situação da fila no sistema'
    };
    const message = `Você foi convidado para ${userFunction[user.role]} - Comece agora acessando ${Config.get(
      'app.urlFrontAdmin'
    )}`;
    await AwsProvider.dispatchSMS(user.phone, message);
  }
}

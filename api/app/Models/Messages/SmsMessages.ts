import AwsProvider from '@ioc:Adonis/Providers/Aws';
import { UserType } from 'App/Models/User';
import Config from '@ioc:Adonis/Core/Config';
import RollbarProvider from '@ioc:Adonis/Providers/Rollbar';

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
    RollbarProvider.info('Sending SMS', { sms: { phone: user.phone, message: message } });

    const result = await AwsProvider.dispatchSMS(user.phone, message);
    if (!result) {
      RollbarProvider.info('Failed to send SMS', { sent: result, error: AwsProvider.lastError().message });
      console.log(AwsProvider.lastError().message);
    } else {
      RollbarProvider.info('Finished sending SMS', { sent: result });
    }
  }
}

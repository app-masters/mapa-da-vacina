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
      superAdmin: 'administrar o sistema filômetro',
      prefectureAdmin: `administrar a prefeitura de ${city} no filômetro`,
      placeAdmin: `administrar ${placeTitle} no filômetro`,
      queueObserver: 'atualizar a situação da fila no sistema'
    };
    const message = `Você foi convidado para ${userFunction[user.role]} - Comece agora acessando ${Config.get(
      'app.urlFrontAdmin'
    )}`;
    await AwsProvider.dispatchSMS(user.phone, message);
  }
}

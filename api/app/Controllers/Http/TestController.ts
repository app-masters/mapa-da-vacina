import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import AwsProvider from '@ioc:Adonis/Providers/Aws';

export default class TestController {
  /**
   * Index
   */
  public async testSms({ response }: HttpContextContract) {
    const res = await AwsProvider.dispatchSMS('3232323232', 'Test SMS');
    response.status(200).send(res);
  }
}

import { ConfigContract } from '@ioc:Adonis/Core/Config';
import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';
import { formatPhoneToE164, validatePhone } from 'App/Helpers';

export default class Aws {
  private _sns: SNSClient;
  private _devPhone: string;
  private _nodeEnv: string;
  /**
   * Constructor
   * @param Config
   */
  constructor(Config: ConfigContract) {
    // Get config
    // Amazon Simple Email Service configuration
    const accessKeyId = Config.get('aws.accessKeyId');
    const secretAccessKey = Config.get('aws.secretAccessKey');
    const region = Config.get('aws.region');
    this._sns = new SNSClient({ credentials: { accessKeyId, secretAccessKey }, region });
    this._devPhone = Config.get('aws.devPhone');
    this._nodeEnv = Config.get('app.nodeEnv');
  }

  /**
   * Send an SMS using AWS SNS service
   *
   * @param params SMS data parameters
   */
  public async dispatchSMS(toNumber: string, content: string) {
    try {
      // When not in production, all the phone numbers should be replaced to the DEV_PHONE address in the .ENV file
      let phoneNumber = toNumber;
      if (this._nodeEnv === 'development') {
        if (!this._devPhone) throw new Error('Missing AWS_DEV_PHONE variable in .env file');
        phoneNumber = this._devPhone;
      }

      // Validates the phone number
      if (!validatePhone(phoneNumber)) {
        throw new Error(`Invalid recepient phone number: ${phoneNumber}`);
      }

      // Check if the content size is less than 140bytes long
      // see: https://docs.aws.amazon.com/sns/latest/dg/sms_publish-to-phone.html
      if (Buffer.byteLength(content) > 140) {
        throw new Error(`Message content exceeds the maximum of 140 bytes`);
      }

      const SNSParams: PublishCommandInput = {
        PhoneNumber: formatPhoneToE164(phoneNumber),
        Message: content
      };

      const data = await this._sns.send(new PublishCommand(SNSParams));
      console.log('Real SMS sent - to: ' + SNSParams.PhoneNumber + ' - message: ' + SNSParams.Message);
      return data;
    } catch (err) {
      console.error(err, err.stack);
    }
  }
}

import { ConfigContract } from '@ioc:Adonis/Core/Config';
import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';
import { formatPhoneToE164, validatePhone } from 'App/Helpers';

export default class Aws {
  private _sns: SNSClient;
  private _devPhone: string;
  private _nodeEnv: string;
  private _lastError: Error;

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
    // When not in production, all the phone numbers should be replaced to the DEV_PHONE address in the .ENV file
    let phoneNumber = toNumber;
    if (this._nodeEnv === 'development') {
      if (!this._devPhone) {
        this._lastError = new Error('Missing AWS_DEV_PHONE variable in .env file');
        return false;
      }
      phoneNumber = this._devPhone;
    }

    // Validates the phone number
    if (!validatePhone(phoneNumber)) {
      this._lastError = new Error(`Invalid recipient phone number: ${phoneNumber}`);
      return false;
    }

    // Check if the content size is less than 140bytes long
    // see: https://docs.aws.amazon.com/sns/latest/dg/sms_publish-to-phone.html
    /*if (Buffer.byteLength(content) > 140) {
      this._lastError = new Error(`Message content exceeds the maximum of 140 bytes`);
      return false;
    }*/

    const SNSParams: PublishCommandInput = {
      PhoneNumber: formatPhoneToE164(phoneNumber),
      Message: content
    };

    try {
      console.log('Sending real SMS - to: ' + SNSParams.PhoneNumber + ' - message: ' + SNSParams.Message);
      await this._sns.send(new PublishCommand(SNSParams));
      return true;
    } catch (err) {
      console.error(err, err.stack);
      this._lastError = err;
      return false;
    }
  }

  /**
   * Return last occurred error
   */
  public lastError() {
    return this._lastError;
  }
}

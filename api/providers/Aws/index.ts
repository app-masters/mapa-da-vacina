// Import required AWS SDK clients and commands for Node.js
import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';

export default class Aws {
  private _sns: SNSClient;

  /**
   * Constructor
   * @param Config
   */
  constructor(Config) {
    // Get config
    // Amazon Simple Email Service configuration
    const accessKeyId = Config.get('aws.snsAccessKeyId');
    const secretAccessKey = Config.get('aws.snsSecretAccessKey');
    const region = Config.get('aws.snsRegion');
    this._sns = new SNSClient({ credentials: { accessKeyId, secretAccessKey }, region });

  }

  /**
   * Send an SMS using AWS SNS service
   *
   * @param params SMS data parameters
   */
  public async dispatchSMS(toNumber: string, content: string) {
    // When not in production, all the phone numbers should be replaced to the DEV_PHONE address in the .ENV file
    let phoneNumber = toNumber;
    /*
    if (NODE_ENV === 'development') {
      if (!this._devPhone) throw new Error('Missing DEV_PHONE variable in .env file');
      phoneNumber = this._devPhone;
    }
    */
    // Validates the phone number
    //if (!validatePhone(phoneNumber)) {
    if (phoneNumber) {
      throw new Error(`Invalid recepient phone number: ${phoneNumber}`);
    }

    // Check if the content size is less than 140bytes long
    // see: https://docs.aws.amazon.com/sns/latest/dg/sms_publish-to-phone.html
    if (Buffer.byteLength(content) > 140) {
      throw new Error(`Message content exceeds the maximum of 140 bytes`);
    }

    const SNSParams: PublishCommandInput = {
      PhoneNumber: phoneNumber,//formatPhoneToE164(phoneNumber),
      Message: content
    };

    try {
      const data = this._sns.send(new PublishCommand(SNSParams));
      console.log('Success, message published. MessageID is ' + data.MessageId);
    } catch (err) {
      console.error(err, err.stack);
    }
  }
}

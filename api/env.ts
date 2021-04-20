/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env';

export default Env.rules({
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),
  GOOGLE_APPLICATION_CREDENTIALS: Env.schema.string(),
  GOOGLE_DATABASE_URL: Env.schema.string(),
  AWS_ACCESS_KEY: Env.schema.string.optional(),
  AWS_SECRET_ACCESS_KEY: Env.schema.string.optional(),
  AWS_REGION: Env.schema.string.optional(),
  AWS_DEV_PHONE: Env.schema.string.optional(),
  ROLLBAR_SERVER_TOKEN: Env.schema.string.optional(),
  SMTP_HOST: Env.schema.string.optional({ format: 'host' }),
  SMTP_PORT: Env.schema.number.optional(),
  SMTP_USER: Env.schema.string.optional(),
  SMTP_PASS: Env.schema.string.optional(),
  MAIL_FROM: Env.schema.string.optional(),
  MAIL_SSLV3: Env.schema.boolean.optional(),
  MAIL_FROM_NAME: Env.schema.string.optional(),
  CONTACT_EMAIL: Env.schema.string.optional(),
  MINUTES_RANGE_TO_CHECK: Env.schema.number.optional(),
  GET_COORDINATES_URL: Env.schema.string(),
  GET_ZIP_URL: Env.schema.string(),
  QUEUE_STATUS_MEAN_INTERVAL: Env.schema.number()
});

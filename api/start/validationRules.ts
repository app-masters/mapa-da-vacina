import { validator } from '@ioc:Adonis/Core/Validator';
import { sanitizeSurname } from 'App/Helpers';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

validator.rule('phone', (value, _, { pointer, arrayExpressionPointer, errorReporter, mutate }) => {
  /**
   * Skip validation when value is not a string. The string
   * schema rule will handle it
   */
  if (typeof value !== 'string') {
    return;
  }

  /**
   * Parse phone number from a string
   */
  const phoneNumber = parsePhoneNumberFromString(value, 'BR');

  /**
   * Report error when phone number is not valid
   */
  if (!phoneNumber || !phoneNumber.isValid()) {
    errorReporter.report(pointer, 'phone', 'Número de telefone inválido', arrayExpressionPointer);
    return;
  }

  const normalized = phoneNumber.number;
  mutate(normalized);
});

validator.rule('nameSurname', (value, _, { mutate }) => {
  /**
   * Skip validation when value is not a string. The string
   * schema rule will handle it
   */
  if (typeof value !== 'string') {
    return;
  }

  const normalized = sanitizeSurname(value);
  mutate(normalized);
});

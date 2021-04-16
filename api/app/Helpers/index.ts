import slugify from 'slugify';

/**
 * Returns a slug
 */
export const getSlug = (string: string): string => {
  const slug = slugify(string, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
  return slug;
};

/**
 * Return the sanitized surname
 */
export const sanitizeSurname = (value: string) => {
  const array = value.split(' ');
  const result: Array<string> = [];
  const values = ['de', 'da', 'das', 'do', 'dos', 'del', 'e', 'DE', 'DA', 'DAS', 'DO', 'DOS', 'DEL', 'E'];
  for (const word of array) {
    if (values.includes(word)) {
      result.push(word.toLowerCase());
    } else {
      result.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    }
  }
  return result.join(' ');
};

/**
 * Return the sanitized surname
 */
export const sanitizePlaceTitle = (value: string) => {
  const removeBreaks = value.trim().replace(/\n|\r/g, '');
  const array = removeBreaks.split(' ');
  const result: Array<string> = [];
  const values = ['de', 'da', 'das', 'do', 'dos', 'del', 'e', 'DE', 'DA', 'DAS', 'DO', 'DOS', 'DEL', 'E'];
  const keys = ['ubs', 'ama', 'ubs/ama', 'ama/ubs'];
  for (const word of array) {
    if (values.includes(word)) {
      result.push(word.toLowerCase());
    } else if (keys.includes(word.toLowerCase())) {
      result.push(word.toUpperCase());
    } else {
      result.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    }
  }
  return result.join(' ');
};

/**
 * Return the sanitized surname
 */
export const sanitizeAddress = (value: string) => {
  if (!value) return;
  const removeBreaks = value.trim().replace(/\n|\r/g, '');
  const array = removeBreaks.split(' ');
  const result: Array<string> = [];
  const values = ['de', 'da', 'das', 'do', 'dos', 'del', 'e', 'DE', 'DA', 'DAS', 'DO', 'DOS', 'DEL', 'E'];
  const keys = ['ubs', 'ama', 'ubs/ama', 'ama/ubs'];
  const states = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO'
  ];
  for (const word of array) {
    if (values.includes(word)) {
      result.push(word.toLowerCase());
    } else if (keys.includes(word.toLowerCase())) {
      result.push(word.toUpperCase());
    } else if (states.includes(word.toUpperCase())) {
      result.push(word.toUpperCase());
    } else {
      result.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    }
  }
  return result.join(' ').replace(/,/g, ', ');
};

/**
 * Return the sanitized string
 */
export const sanitizeString = (value: string) => {
  if (!value) return;
  const removeBreaks = value.trim().replace(/\n|\r/g, '');
  return removeBreaks;
};

/**
 * Validates a phone number
 *
 * Base phone must have 8 or 9 digits and DDD must have 2 digits
 *
 * @param phoneNumber number to be validated
 * @returns true if is a valid number, false otherwise
 */
export const validatePhone = (phoneNumber: string): boolean => {
  const onlyNumber = phoneNumber.replace(/\D/g, '');
  return !!onlyNumber && !!onlyNumber.match(/^\d{10,11}$/);
};

/**
 * Format phone number to E.164 standard
 * @param phoneNumber number to be formated
 * @returns the formated phone number
 */
export const formatPhoneToE164 = (phoneNumber: string) => {
  let formatedNumber = phoneNumber.replace(/\D/g, '');
  // If the phone number is missing +55
  if (formatedNumber.length <= 11) {
    formatedNumber = `55${formatedNumber}`;
  }
  if (formatedNumber[0] !== '+') {
    formatedNumber = `+${formatedNumber}`;
  }
  return formatedNumber;
};

/**
 * Sanitize a zip, return it with only numbers, or null
 */
export const sanitizeZip = (zip: string) => {
  if (!zip) return;
  let match = zip.match(/\d+/g);
  if (!match) return;
  const zipCode = match.join('');
  if (zipCode.length !== 8) return;
  return zipCode;
};

/**
 * Return difference in minutes considering only the time
 * @param a Date
 * @param b Date
 * @returns Difference in minutes
 */
export const minutesDiff = (a: Date, b: Date) => {
  return a.getMinutes() + a.getHours() * 60 - (b.getMinutes() + b.getHours() * 60);
};

/**
 * Return difference in minutes considering only the time
 * @param a Date
 * @param b Date
 * @returns Difference in minutes
 */
export const IsNowBetweenTimes = (a: Date, b: Date) => {
  const now = new Date();
  const minutes = now.getMinutes() + now.getHours() * 60;
  return minutes >= a.getMinutes() + a.getHours() * 60 && minutes <= b.getMinutes() + b.getHours() * 60;
};

/**
 * Return difference in minutes considering only the time
 * @param a Date
 * @param b Date
 * @returns Difference in minutes
 */
export const parseBoolFromString = (value: string) => {
  const trues = ['true', 'TRUE', '1', 'True'];
  const falses = ['false', 'FALSE', '0', 'False'];

  if (trues.includes(value)) return true;
  if (falses.includes(value)) return false;
  return false;
};

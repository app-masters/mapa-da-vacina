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
}

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

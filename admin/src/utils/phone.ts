const countryCodes = ['+55'];

/**
 * formatPhone
 */
export const formatPhone = (text) => {
  let formattedText = text;
  for (const country of countryCodes) {
    formattedText = formattedText.replace(country, '');
  }
  return formattedText.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
};

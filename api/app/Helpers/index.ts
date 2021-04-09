import slugify from 'slugify';

/**
 * Returns a slug
 */
export function getSlug(string: string): string {
  const slug = slugify(string, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
  return slug;
}

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

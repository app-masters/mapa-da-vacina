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

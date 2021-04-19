import { Prefecture } from '../lib/Prefecture';
import logging from './logging';

/**
 * Get prefecture Data
 */
export const getPrefectureData = async (id?: string): Promise<Prefecture> => {
  try {
    if (id === 'new') id = null; // Undefined ID, don't fetch it

    // Defining NEXT_PUBLIC_PREFECTURE_ID as prefecture ID
    let prefectureId = id || process.env.NEXT_PUBLIC_PREFECTURE_ID;
    if (!prefectureId) {
      // No prefecture id defined, getting from online variable
      const possibleId = window.location.host.split('.')[0];
      if (JSON.parse(process.env.NEXT_PUBLIC_HEROKU).indexOf(possibleId) > -1) {
        prefectureId = possibleId;
      }
      if (!prefectureId) {
        // No prefecture found online either, throw error
        throw Error('You need to define a NEXT_PUBLIC_PREFECTURE_ID on your .env to be able to fetch the data');
      }
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prefecture/${prefectureId}`);
    const data = await res.json();
    return data;
  } catch (error) {
    logging.error(error);
    return {} as Prefecture;
  }
};

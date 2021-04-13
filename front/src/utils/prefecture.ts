import { Prefectures } from '../lib/Prefectures';
// import logging from './logging';

/**
 * Get prefecture ID
 */
export const getPrefectureData = async (): Promise<Prefectures> => {
  try {
    // Defining NEXT_PUBLIC_PREFECTURE_ID as prefecture ID
    let prefectureId = process.env.NEXT_PUBLIC_PREFECTURE_ID;
    if (!prefectureId) {
      // No prefecture id defined, getting from online variable
      console.log('NEXT_PUBLIC_HEROKU', process.env.NEXT_PUBLIC_HEROKU);
      console.log('window.location', window.location);
      const possibleId = window.location.host.split('.')[0];
      console.log('subdomain', possibleId);
      if (JSON.parse(process.env.NEXT_PUBLIC_HEROKU).indexOf(possibleId) > -1) {
        prefectureId = possibleId;
      }
      if (!prefectureId) {
        // No prefecture found online either, throw error
        throw Error('You need to define a NEXT_PUBLIC_PREFECTURE_ID on your .env to be able to fetch the data');
      }
    }
    console.log('prefectureId', prefectureId);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prefectures/${prefectureId}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return {} as Prefectures;
  }
};

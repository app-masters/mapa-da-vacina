import { Prefectures } from '../lib/Prefectures';

/**
 * Get prefecture ID
 */
export const getPrefectureData = async (): Promise<Prefectures> => {
  try {
    let prefectureId = process.env.NEXT_PUBLIC_PREFECTURE_ID;
    if (!prefectureId) {
      // No prefecture id defined, getting from online variable
      prefectureId = JSON.parse(process.env.NEXT_PUBLIC_HEROKU)[window.location.host];
      if (!prefectureId) {
        // No prefecture found online either, throw error
        throw Error('You need to define a NEXT_PUBLIC_PREFECTURE_ID on your .env to be able to fetch the data');
      }
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prefectures/${process.env.NEXT_PUBLIC_PREFECTURE_ID}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return {} as Prefectures;
  }
};

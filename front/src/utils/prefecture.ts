import { Prefecture } from '../lib/Prefecture';
import { calcDistance } from './geolocation';
import logging from './logging';
import { sortPlacesByDistance } from './sort';

/**
 * Get prefecture Data
 */
export const getPrefectureData = async (id?: string, coordinates?: GeolocationPosition): Promise<Prefecture> => {
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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/prefecture/${prefectureId}`;
    const res = await fetch(url);
    const data = (await res.json()) as Prefecture;

    let places = data.places.map((place) => ({
      ...place,
      distance: calcDistance(coordinates, place)
    }));

    places = places.sort((a, b) => {
      return (
        +b.open - +a.open ||
        +(b.openToday ? b.openToday : 0) - +(a.openToday ? a.openToday : 0) ||
        +(b.openTomorrow ? b.openTomorrow : 0) - +(a.openTomorrow ? a.openTomorrow : 0) ||
        b.type.localeCompare(a.type) ||
        a.title.localeCompare(b.title)
      );
    });

    if (coordinates) {
      places = sortPlacesByDistance(places);
    }

    return { ...data, places };
  } catch (error) {
    logging.error(error);
    return {} as Prefecture;
  }
};

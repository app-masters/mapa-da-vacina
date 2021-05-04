import { Place } from '../lib/Place';

/**
 * sortPlacesByDistance
 */
export const sortPlacesByDistance = (places: Place[]) => {
  if (places.length > 0) {
    return places.sort((a, b) => {
      if (!b.distance) return -1;
      if (!a.distance) return 0;
      return a.distance - b.distance;
    });
  }
};

/**
 * sortPlacesDefaultByName
 */
export const sortPlacesDefaultByName = (places: Place[]) => {
  if (places.length > 0) {
    return places.sort((a, b) => {
      return (
        a.title.localeCompare(b.title) ||
        +b.open - +a.open ||
        +(b.openToday ? b.openToday : 0) - +(a.openToday ? a.openToday : 0) ||
        +(b.openTomorrow ? b.openTomorrow : 0) - +(a.openTomorrow ? a.openTomorrow : 0) ||
        b.type.localeCompare(a.type)
      );
    });
  }
};

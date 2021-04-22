import { getDistance } from 'geolib';
import { Place } from '../lib/Place';

/**
 * Calculate distance between points (x1,y1) and (x2,y2)
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns distance
 */
export const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

/**
 * calcDistance
 */
export const calcDistance = (coordinates: GeolocationPosition, item: Place): number => {
  if (!coordinates || !item.latitude || !item.longitude) return null;
  return getDistance(
    { latitude: coordinates.coords.latitude, longitude: coordinates.coords.longitude },
    { latitude: item.latitude, longitude: item.longitude }
  );
};

/**
 * convertDistance
 */
export const distanceHumanize = (distance) => {
  const metersAway = distance / 1000;
  if (metersAway > 1) {
    return `${metersAway.toFixed(1)}km`.replace('.', ',');
  }
  return `${metersAway * 1000}m`;
};

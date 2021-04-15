import { Place } from './Place';

export type Prefectures = {
  id: string;
  name: string;
  slug: string;
  places: Place[];
  numPlaces?: number;
  numPlacesOpen?: number;
  createdAt: Date;
  updatedAt: Date;
};

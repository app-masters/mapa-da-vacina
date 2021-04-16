import { Place } from './Place';

export type Prefecture = {
  id: string;
  name: string;
  slug: string;
  places: Place[];
  numPlaces?: number;
  numPlacesOpen?: number;
  createdAt: Date;
  updatedAt: Date;
  showQueueUpdatedAt?: boolean;
  sampleMode?: boolean;
  state?: string;
  city?: string;
};

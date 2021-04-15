import { Place } from './Place';

export type Prefecture = {
  id: string;
  name: string;
  slug: string;
  places: Place[];
  createdAt: Date;
  updatedAt: Date;
  showQueueUpdatedAt?: boolean;
};

import { Place } from './Place';

export type Prefectures = {
  id: string;
  name: string;
  slug: string;
  places: Place[];
  createdAt: Date;
  updatedAt: Date;
};

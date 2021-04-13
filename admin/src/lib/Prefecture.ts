import { Place } from './Place';

export type Prefecture = {
  id: string;
  name: string;
  slug: string;
  place?: Place[];
  logoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

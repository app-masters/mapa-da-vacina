import { Place } from './Place';

export type Prefecture = {
  id: string;
  name: string;
  slug: string;
  place?: Place[];
  state: string;
  city: string;
  active: boolean;
  logoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

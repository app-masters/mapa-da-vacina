import { userRoleType } from '../utils/constraints';

export type User = {
  id: string;
  uid?: string;
  name?: string;
  role?: userRoleType;
  phone: string;
  prefectureId?: string;
  placeId?: string;
  active: boolean;
  signedUpAt?: Date | string | { seconds?: number; nanoseconds?: number };
  invitedAt?: Date | string | { seconds?: number; nanoseconds?: number };
};

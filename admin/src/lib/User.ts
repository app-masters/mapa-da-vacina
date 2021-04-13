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
  signedUpAt?: { seconds?: number };
  invitedAt?: { seconds?: number };
};

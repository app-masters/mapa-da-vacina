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
<<<<<<< HEAD
  signedUpAt?: { seconds?: number };
  invitedAt?: { seconds?: number };
=======
  signedUpAt?: Date | string | { seconds?: number; nanoseconds?: number };
  invitedAt?: Date | string | { seconds?: number; nanoseconds?: number };
>>>>>>> b1d2ec829a28c1a39502390ed2de5e1b9faf576f
};

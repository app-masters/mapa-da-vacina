export type userRoleType = 'superAdmin' | 'prefectureAdmin' | 'placeAdmin' | 'queueObserver';

export const userRoles = {
  superAdmin: 'superAdmin',
  prefectureAdmin: 'prefectureAdmin',
  placeAdmin: 'placeAdmin',
  queueObserver: 'queueObserver'
};

export const userRolesLabel = {
  superAdmin: 'Super Admin',
  prefectureAdmin: 'Admin da prefeitura',
  placeAdmin: 'Admin do local',
  queueObserver: 'Observador'
};

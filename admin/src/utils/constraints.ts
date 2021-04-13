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

export type placeQueueStatusType = 'noQueue' | 'smallQueue' | 'mediumQueue' | 'longQueue';

export const placeQueue: { [key: string]: placeQueueStatusType } = {
  noQueue: 'noQueue',
  smallQueue: 'smallQueue',
  mediumQueue: 'mediumQueue',
  longQueue: 'longQueue'
};

export const placeQueueLabel = {
  noQueue: 'Sem fila',
  smallQueue: 'Pouca fila',
  mediumQueue: 'Filas moderadas',
  longQueue: 'Filas intensas'
};

export const placeQueueColor = {
  noQueue: '#3FAFB5',
  smallQueue: '#E3C153',
  mediumQueue: '#ED902C',
  longQueue: '#A71319'
};

export type placeTypes = 'fixed' | 'driveThru';

export const placeType = {
  fixed: 'fixed',
  driveThru: 'driveThru'
};

export const placeTypeLabel = {
  fixed: 'Fixo',
  driveThru: 'Drive Thru'
};

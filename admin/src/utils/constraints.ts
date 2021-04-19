export type userRoleType = 'superAdmin' | 'prefectureAdmin' | 'placeAdmin' | 'queueObserver';

export const userRoles = {
  superAdmin: 'superAdmin',
  prefectureAdmin: 'prefectureAdmin',
  placeAdmin: 'placeAdmin',
  queueObserver: 'queueObserver'
};

export const userRolesLabel = {
  superAdmin: 'Super Admin',
  prefectureAdmin: 'Administrador na prefeitura',
  placeAdmin: 'Administrador no ponto de vacinação',
  queueObserver: 'Observador da fila'
};

export type placeQueueStatusType = 'open' | 'closed' | 'noQueue' | 'smallQueue' | 'mediumQueue' | 'longQueue';

export const placeQueue: { [key: string]: placeQueueStatusType } = {
  open: 'open',
  closed: 'closed',
  noQueue: 'noQueue',
  smallQueue: 'smallQueue',
  mediumQueue: 'mediumQueue',
  longQueue: 'longQueue'
};

export const placeQueueLabel = {
  open: 'Aberto',
  closed: 'Fechado',
  noQueue: 'Sem fila',
  smallQueue: 'Pouca fila',
  mediumQueue: 'Filas moderadas',
  longQueue: 'Filas intensas'
};

export const placeQueueHelp = {
  open: undefined,
  closed: undefined,
  noQueue: 'menos de 5 minutos de espera',
  smallQueue: 'até 10 minutos de espera',
  mediumQueue: 'até 20 minutos de espera',
  longQueue: 'além de 20 minutos de espera'
};

export const placeQueueColor = {
  open: '#16a085',
  closed: '#879395',
  noQueue: '#06a555',
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

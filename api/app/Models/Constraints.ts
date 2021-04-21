export type PlaceQueueStatusType = 'open' | 'closed' | 'noQueue' | 'smallQueue' | 'mediumQueue' | 'longQueue';

export const QueueUpdateConstraint: { [key: string]: PlaceQueueStatusType } = {
  open: 'open',
  closed: 'closed',
  noQueue: 'noQueue',
  smallQueue: 'smallQueue',
  mediumQueue: 'mediumQueue',
  longQueue: 'longQueue'
};

export const QueueUpdateValues: { [key: string]: number } = {
  open: 0,
  noQueue: 1,
  smallQueue: 2,
  mediumQueue: 3,
  longQueue: 4,
  closed: 5
};

export const QueueUpdateIndexes: { [key: number]: string } = {
  0: 'open',
  1: 'noQueue',
  2: 'smallQueue',
  3: 'mediumQueue',
  4: 'longQueue',
  5: 'closed'
};

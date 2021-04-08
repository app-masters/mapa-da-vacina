import { IErrorFactory } from 'firestore-storage';

/**
 * Test error factory
 * @param msg error message
 * @returns error factory
 */
export const errorFactory: IErrorFactory = (msg) => {
  return new Error(msg);
};

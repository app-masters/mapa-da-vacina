import firebase from 'firebase';
import { User } from '../lib/User';
import { userRoles } from './constraints';

/**
 * returnCollectionByName
 */
export const returnCollectionByName = (collection: string) => {
  return firebase.firestore().collection(collection);
};

/**
 * returnCollectionA
 */
export const returnCollectionGroupByName = (collection: string) => {
  return firebase.firestore().collectionGroup(collection);
};

/**
 * listUsersByPrefecture
 */
export const listUsersByPrefecture = () => {
  const user = JSON.parse(localStorage.getItem('@auth-user')) as User;
  if (user.role === userRoles.superAdmin) {
    return firebase.firestore().collectionGroup('user');
  }
  return firebase.firestore().collection('prefecture').doc(user.prefectureId).collection('user');
};

/**
 * disableUser
 */
export const disableUser = async (id: string, userId: string) => {
  return await firebase.firestore().collection('prefecture').doc(id).collection('user').doc(userId).update({
    active: false
  });
};

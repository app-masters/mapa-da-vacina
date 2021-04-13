import firebase from 'firebase';
import { placeQueueStatusType } from './constraints';

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
  const prefecture = JSON.parse(localStorage.getItem('@auth-prefecture'));
  return firebase.firestore().collection('prefecture').doc(prefecture?.id).collection('user');
};

/**
 * disableUser
 */
export const disableUser = async (id: string, userId: string) => {
  return await firebase.firestore().collection('prefecture').doc(id).collection('user').doc(userId).update({
    active: false
  });
};

/**
 * updatePlace
 */
export const updatePlace = async (id: string, place) => {
  return await firebase
    .firestore()
    .collectionGroup('place')
    .get()
    .then((snap) => {
      snap.docs.forEach((doc) => {
        if (doc.id === id) {
          doc.ref.update({ ...place });
        }
      });
    });
};

/**
 * updatePlace
 */
export const createQueueUpdate = async (placeId: string, prefectureId: string, status: placeQueueStatusType) => {
  const user = JSON.parse(localStorage.getItem('@auth-user'));
  return await firebase
    .firestore()
    .collection('prefecture')
    .doc(prefectureId)
    .collection('place')
    .doc(placeId)
    .collection('queueUpdate')
    .add({
      createdAt: new Date(),
      placeId,
      queueStatus: status,
      userId: user.id
    });
};

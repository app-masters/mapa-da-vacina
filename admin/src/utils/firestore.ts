import firebase from 'firebase';
import { Place } from '../lib/Place';
import { User } from '../lib/User';
import { userRoles, placeQueueStatusType } from './constraints';
import slugify from 'slugify';

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
export const listUsersByPrefecture = (user) => {
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

/**
 * updatePlace
 */
export const updatePlace = async (id: string, prefectureId: string, place) => {
  return await firebase
    .firestore()
    .collection('prefecture')
    .doc(prefectureId)
    .collection('place')
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
 * createPlace
 */
export const createPlace = async (prefectureId: string, place: Place) => {
  return await firebase
    .firestore()
    .collection('prefecture')
    .doc(prefectureId)
    .collection('place')
    .doc(slugify(place.title.toLowerCase()))
    .set(place);
};

/**
 * createQueueUpdate
 */
export const createQueueUpdate = async (
  placeId: string,
  prefectureId: string,
  open: boolean,
  status: placeQueueStatusType,
  userId: string
) => {
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
      open,
      queueStatus: status,
      userId
    });
};

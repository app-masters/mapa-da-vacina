import firebase from 'firebase';

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

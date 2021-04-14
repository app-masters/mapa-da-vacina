import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
const db = admin.firestore();

export const createQueueUpdate = functions.firestore
  .document(
    "prefecture/{prefectureId}/place/{placeId}/queueUpdate/{queueUpdateId}"
  )
  .onCreate((snap, context) => {
    console.log(
      `Prefecture: ${context.params.prefectureId}, Place: ${context.params.placeId}, QueueUpdate: ${context.params.queueUpdateId}`
    );
    const queueRef = snap.ref;
    const newValue = snap.data();

    const placeRef = queueRef.parent.parent;
    return placeRef?.update({
      queueStatus: newValue.queueStatus,
      open: newValue.open,
      queueUpdatedAt: new Date()
    });
  });

export const totalizeOpenPlacesCount = functions.firestore
  .document("prefecture/{prefectureId}/place/{placeId}")
  .onWrite((change, context) => {
    console.log(
      `Prefecture: ${context.params.prefectureId}, Place: ${context.params.placeId}`
    );

    const afterValue = change.after.data();
    const beforeValue = change.before.data();

    if (
      (change.after.exists && !change.before.exists) ||
      (!change.after.exists && change.before.exists) ||
      beforeValue?.active !== afterValue?.active ||
      beforeValue?.open !== afterValue?.open
    ) {
      //if it was created or deleted or open/active changed
      let numActive = 0;
      let numOpen = 0;

      const placeRef = change.after.ref;
      const prefectureRef = placeRef.parent.parent;

      return db.collection("prefecture")
        .doc(context.params.prefectureId)
        .collection("place")
        .where("active", "==", true)
        .get()
        .then((querySnapshot) => {
          numActive = querySnapshot.size;
          numOpen = querySnapshot.docs.filter((snap) => snap.data().open)
            .length;
          console.log(numActive, numOpen);
          return prefectureRef?.update({
            numPlaces: numActive,
            numPlacesOpen: numOpen,
          });
        });
        
    } else {
      return null;
    }
  });

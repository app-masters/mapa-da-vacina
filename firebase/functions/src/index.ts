import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
// const db = admin.firestore();

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
    return placeRef?.update({ queueStatus: newValue.queueStatus });
  });

export const totalizeOpenPlaces = functions.firestore
  .document("prefecture/{prefectureId}/place/{placeId}")
  .onWrite((change, context) => {
    console.log(
      `Prefecture: ${context.params.prefectureId}, Place: ${context.params.placeId}`
    );

    const afterValue = change.after.data();
    const beforeValue = change.before.data();

    let incrementNumber = 0;
    let incrementOpen = 0;

    if (change.after.exists && !change.before.exists) {
      //if it was created, add new place
      if (afterValue && afterValue.active) {
        incrementNumber = 1;
        if (afterValue && afterValue.open) {
          incrementOpen = 1;
        }
      }
    } else if (!change.after.exists && change.before.exists) {
      //if it was deleted, add remove a place
      if (beforeValue && beforeValue.active) {
        incrementNumber = -1;
        if (beforeValue && beforeValue.open) {
          incrementOpen = -1;
        }
      }
    } else {
      if (beforeValue?.active && !afterValue?.active) {
        // if was open and then closed, decrement 1
        incrementNumber = -1;
        if (beforeValue.open) incrementOpen = -1;
      } else if (!beforeValue?.active && afterValue?.active) {
        // if was closed and then open, increment 1
        incrementNumber = 1;
        if (afterValue.open) incrementOpen = 1;
      } else if (beforeValue?.active && afterValue?.active) {
        // edited, both before and after exists
        if (beforeValue?.open && !afterValue?.open) {
          // if was open and then closed, decrement 1
          incrementOpen = -1;
        } else if (!beforeValue?.open && afterValue?.open) {
          // if was closed and then open, increment 1
          incrementOpen = 1;
        }
      }
    }

    const placeRef = change.after.ref;
    const prefectureRef = placeRef.parent.parent;

    return prefectureRef?.update({
      numPlaces: admin.firestore.FieldValue.increment(incrementNumber),
      numPlacesOpen: admin.firestore.FieldValue.increment(incrementOpen),
    });
  });

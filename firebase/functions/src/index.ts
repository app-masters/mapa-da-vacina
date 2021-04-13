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
    return placeRef?.update({ queueStatus: newValue.queueStatus, open: newValue.open });
  });

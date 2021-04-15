import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { Client } from "@googlemaps/google-maps-services-js";
const client = new Client({});

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
      queueUpdatedAt: new Date(),
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

      return db
        .collection("prefecture")
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

/*

const extractGeo = (type, geometry) => {
  if (geometry && geometry.location) {
    const value = geometry.location[type];
    return Number.parseFloat(value).toFixed(6);
  }
};
*/

export const getCoordinates = functions.https.onCall(async (data) => {
  /**
   * Sanitize a zip, return it with only numbers, or null
   */
  const sanitizeZip = (zip: string): string => {
    if (!zip) return "";
    const match = zip.match(/\d+/g);
    if (!match) return "";
    const zipCode = match.join("");
    if (zipCode.length !== 8) return "";
    return zipCode;
  };

  console.log(data);
  const zip = sanitizeZip(data.zip);
  // Checks database first
  const dbResult = await db.collection("zipCoordinate").doc(zip).get();
  if (dbResult.exists) return dbResult.data();

  //If non-existent, check google API
  const googleApiKey = functions.config().googlemaps.key;
  // console.log(googleApiKey);
  if (!googleApiKey) {
    console.log("    👉  No GOOGLE_API_KEY, will not fetch coordinates");
    return;
  }

  const queryData = await client.geocode({
    params: {
      components: "postal_code:" + zip + "|country:BR",
      key: googleApiKey,
    },
  });
  console.log(queryData);
  if (queryData && queryData.statusText === "OK") {
    const geometry = data.results[0].geometry;
    console.log("geometry", geometry);

    const returnData = {
      zip: zip,
      latitude: Number.parseFloat(geometry.location.latitude).toFixed(6),
      longitude: Number.parseFloat(geometry.location.longitude).toFixed(6),
    };
    await dbResult.ref.create(returnData);

    return returnData;
  } else if (data) {
    // Show some log if we don't know how to handle this result
    if (!["ZERO_RESULTS"].includes(data.statusText)) {
      console.log("  ‼️ unexpected result from Google Maps", data);
    }
  }
  return;
});

import * as assert from "assert";
import * as firebase from "@firebase/testing";

const PROJECT_ID = "filometro-dev-3d";

const authSuperAdmin = {
  uid: "super_uid",
  role: "superAdmin",
};
const authPrefectureAdmin = {
  uid: "super_uid",
  role: "prefectureAdmin",
  prefectureId: "test_pref",
};
const authPlaceAdmin = {
  uid: "super_uid",
  role: "placeAdmin",
  prefectureId: "test_pref",
  placeId: "test_place",
};
const authQueueObserver = {
  uid: "super_uid",
  role: "queueObserver",
  prefectureId: "test_pref",
  placeId: "test_place",
};

const getFirestore = (auth: Record<string, unknown>) => {
  return firebase
    .initializeTestApp({ projectId: PROJECT_ID, auth: auth })
    .firestore();
};

describe("Mapa da Vacina", () => {
  it("test", () => {
    assert.strictEqual(2 + 2, 4);
  });

  it("Super admin can write to everything", async () => {
    const db = getFirestore(authSuperAdmin);
    const pref = db.collection("prefecture").doc("test_pref");
    const place = db
      .collection("prefecture")
      .doc("test_pref")
      .collection("place")
      .doc("test_place");
    const user = db
      .collection("prefecture")
      .doc("test_pref")
      .collection("user")
      .doc("test_user");

    await firebase.assertSucceeds(pref.set({ name: "Test" }));
    await firebase.assertSucceeds(place.set({ name: "Test" }));
    await firebase.assertSucceeds(user.set({ name: "Test" }));
  });

  it("Only Prefecture Admin can write to a prefecture", async () => {
    const db = getFirestore(authPrefectureAdmin);
    const pref = db.collection("prefecture").doc("test_pref");

    await firebase.assertSucceeds(pref.set({ name: "Test" }));

    const authPrefectureAdminOtherPref = {
      uid: "super_uid",
      role: "prefectureAdmin",
      prefectureId: "other_pref",
    };
    const db_2 = getFirestore(authPrefectureAdminOtherPref);
    const pref_2 = db_2.collection("prefecture").doc("test_pref");

    await firebase.assertFails(pref_2.set({ name: "Test" }));
  });

  it("Prefecture Admin can write to a place", async () => {
    const db = getFirestore(authPrefectureAdmin);
    const place = db
      .collection("prefecture")
      .doc("test_pref")
      .collection("place")
      .doc("test_place");

    await firebase.assertSucceeds(place.update({ name: "Test" }));
  });

  it("Non-logged can't write to a prefecture", async () => {
    const db = getFirestore({ uid: "nonlogged" });
    const pref = db.collection("prefecture").doc("test_pref");
    await firebase.assertFails(pref.set({ name: "Test" }));
  });

  it("Place admin can't write to a prefecture", async () => {
    const db = getFirestore(authPlaceAdmin);
    const pref = db.collection("prefecture").doc("test_pref");
    await firebase.assertFails(pref.set({ name: "Test" }));
  });

  it("Queue observer can't write to a prefecture", async () => {
    const db = getFirestore(authQueueObserver);
    const pref = db.collection("prefecture").doc("test_pref");
    await firebase.assertFails(pref.set({ name: "Test" }));
  });

  it("Place Admin can write to a place", async () => {
    const db = getFirestore(authPlaceAdmin);
    const pref = db
      .collection("prefecture")
      .doc("test_pref")
      .collection("place")
      .doc("test_place");

    await firebase.assertSucceeds(pref.set({ name: "Test" }));

    const authPlaceAdminOtherPlace = {
      uid: "super_uid",
      role: "placeAdmin",
      prefectureId: "other_pref",
      placeId: "other_place",
    };
    const db_2 = getFirestore(authPlaceAdminOtherPlace);
    const place_2 = db_2
      .collection("prefecture")
      .doc("test_pref")
      .collection("place")
      .doc("test_place");

    await firebase.assertFails(place_2.set({ name: "Test" }));
  });

  it("Non-logged can't write to a place", async () => {
    const db = getFirestore({ uid: "unlogged" });
    const pref = db
      .collection("prefecture")
      .doc("test_pref")
      .collection("place")
      .doc("test_place");
    await firebase.assertFails(pref.set({ name: "Test" }));
  });

  it("Queue observer can't write to a place", async () => {
    const db = getFirestore(authQueueObserver);
    const pref = db
      .collection("prefecture")
      .doc("test_pref")
      .collection("place")
      .doc("test_place");
    await firebase.assertFails(pref.set({ name: "Test" }));
  });
});

import * as assert from "assert";
import * as firebase from "@firebase/testing";

const PROJECT_ID = "filometro-dev-3d";

const authSuperAdmin = {
  uid: "super_uid",
  role: "superAdmin",
};
/*
const authPrefectureAdmin = {
  uid: "super_uid",
  role: "superAdmin",
  prefectureId: "test_pref",
};
const authPlaceAdmin = {
  uid: "super_uid",
  role: "superAdmin",
};
const authQueueObserver = {
  uid: "super_uid",
  role: "superAdmin",
};
*/
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
    const myAuth = {
      uid: "test_uid",
      role: "prefectureAdmin",
      prefectureId: "test_pref",
    };
    const db = getFirestore(myAuth);
    const pref = db.collection("prefecture").doc("test_pref");

    await firebase.assertSucceeds(pref.set({ name: "Test" }));
  });

  it("Non admin can't write to a prefecture", async () => {
    const myAuth = {
      uid: "test_uid",
      role: "queueObserver",
      prefectureId: "test_pref",
    };
    const db = getFirestore(myAuth);
    const pref = db.collection("prefecture").doc("test_pref");

    await firebase.assertFails(pref.set({ name: "Test" }));
  });

  it("Admin can only write to own prefecture", async () => {
    const myAuth = {
      uid: "test_uid",
      role: "prefectureAdmin",
      prefectureId: "test_pref_wrong",
    };
    const db = getFirestore(myAuth);
    const pref = db.collection("prefecture").doc("test_pref");

    await firebase.assertFails(pref.set({ name: "Test" }));
  });
});

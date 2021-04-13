import * as assert from "assert";
import * as firebase from "@firebase/testing";

const PROJECT_ID = "filometro-dev-3d";

const getFirestore = (auth) => {
  return firebase
    .initializeTestApp({ projectId: PROJECT_ID, auth: auth })
    .firestore();
};

describe("Mapa da Vacina", () => {
  it("test", () => {
    assert.strictEqual(2 + 2, 4);
  });

  it("Only admin can write to a prefecture", async () => {
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

import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./firebase.config"; 

const alreadyCreatedApps = getApps();

const app =
  alreadyCreatedApps.length === 0
    ? initializeApp(firebaseConfig)
    : alreadyCreatedApps[0];

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

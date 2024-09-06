import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyBSa-oMlat_PFPgtReLp6enVs8kt5Q8x3U",
  authDomain: "ccd-app-2024.firebaseapp.com",
  projectId: "ccd-app-2024",
  storageBucket: "ccd-app-2024.appspot.com",
  messagingSenderId: "1028017059751",
  appId: "1:1028017059751:web:5339d59cdd5194ad2ee882",
  measurementId: "G-HVFMR4KQC6",
});

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };

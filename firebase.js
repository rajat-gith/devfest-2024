import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBSa-oMlat_PFPgtReLp6enVs8kt5Q8x3U",
  authDomain: "ccd-app-2024.firebaseapp.com",
  projectId: "ccd-app-2024",
  storageBucket: "ccd-app-2024.appspot.com",
  messagingSenderId: "1028017059751",
  appId: "1:1028017059751:web:5339d59cdd5194ad2ee882",
  measurementId: "G-HVFMR4KQC6",
};

// Check if a Firebase app is already initialized
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Use existing app if already initialized
}

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

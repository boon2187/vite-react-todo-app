import * as firebase from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
};

// Initialize Firebase
if (typeof window !== "undefined" && !firebase.getApps().length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
// firestoreを使うための準備
const getFirebaseDb = (): Firestore => getFirestore();
export const db = getFirebaseDb();
// firebaseのauthを使うための準備
const getFirebaseAuth = (): Auth => getAuth();
export const auth = getFirebaseAuth();

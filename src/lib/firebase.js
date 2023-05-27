import { initializeApp } from 'firebase/app';
import { FieldValue } from 'firebase/firestore';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, FacebookAuthProvider } from "firebase/auth"; // Import this to use Firebase Auth and FacebookAuthProvider

const firebaseConfig = {
  apiKey: "AIzaSyDfGLOVi3hhb9l0kyEfLdncaPEo4XZj3eA",
  authDomain: "instagram-db4bf.firebaseapp.com",
  projectId: "instagram-db4bf",
  storageBucket: "instagram-db4bf.appspot.com",
  messagingSenderId: "792719134167",
  appId: "1:792719134167:web:a8b17476d8c776b37a0f92",
  measurementId: "G-N6X4HVNTT1"
};

const firebaseApp = initializeApp(firebaseConfig);
const { value } = new FieldValue();
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const auth = getAuth(firebaseApp); // Create an instance of Firebase Auth
export const facebookProvider = new FacebookAuthProvider(); // Create an instance of FacebookAuthProvider

export { firebaseApp, value };

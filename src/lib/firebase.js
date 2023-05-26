import { initializeApp } from 'firebase/app';
import { FieldValue } from 'firebase/firestore';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
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
export { firebaseApp, value };

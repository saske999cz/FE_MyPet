import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const apiKey = process.env.API_KEY;
const authDomain = process.env.AUTH_DOMAIN;
const databaseURL = process.env.DATABASE_URL;
const projectId = process.env.PROJECT_ID;
const storageBucket = process.env.STORAGE_BUCKET;
const messagingSenderId = process.env.MESSAGING_SENDER_ID;
const appId = process.env.APP_ID;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  databaseURL: databaseURL,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
export const FIREBASE_STORE = getFirestore(FIREBASE_APP);

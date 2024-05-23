import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCUpFH3N2cKhv1VFzTSmZJNC0O_VKoRoWQ",
  authDomain: "petshop-3d4ae.firebaseapp.com",
  projectId: "petshop-3d4ae",
  storageBucket: "petshop-3d4ae.appspot.com",
  messagingSenderId: "224358929740",
  appId: "1:224358929740:web:d7415b94d29830f25eabe9",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

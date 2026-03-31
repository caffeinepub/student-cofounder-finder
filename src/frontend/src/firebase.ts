import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_qPCx-G0GA4P0hjr6QqjYkKBd7Zgd988",
  authDomain: "teamup-dd3a4.firebaseapp.com",
  projectId: "teamup-dd3a4",
  storageBucket: "teamup-dd3a4.firebasestorage.app",
  messagingSenderId: "197508626131",
  appId: "1:197508626131:web:93072e8dfca111fea18626",
  measurementId: "G-DGM7ZCRLP7",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

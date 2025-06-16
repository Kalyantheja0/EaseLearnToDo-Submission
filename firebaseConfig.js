// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNSRYAtHm0HmToOByGlSpcYXp_6hX-Law",
  authDomain: "easelearntodo.firebaseapp.com",
  projectId: "easelearntodo",
  storageBucket: "easelearntodo.firebasestorage.app",
  messagingSenderId: "549088565946",
  appId: "1:549088565946:web:f73b1644aff1753e990083"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;



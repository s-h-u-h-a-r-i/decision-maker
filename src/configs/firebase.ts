import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVtoWOI-VB5fIe_fMtGVbXbh_ilwD63uU",
  authDomain: "decision-maker-5c9a6.firebaseapp.com",
  projectId: "decision-maker-5c9a6",
  storageBucket: "decision-maker-5c9a6.firebasestorage.app",
  messagingSenderId: "54230485508",
  appId: "1:54230485508:web:c3c655a2a4889b619b8351",
  measurementId: "G-HBS17VXB33",
};

const app = initializeApp(firebaseConfig);
const fbAnalytics = getAnalytics(app);
const firestore = getFirestore(app);
const fbAuth = getAuth(app);

export { fbAnalytics, firestore, fbAuth };

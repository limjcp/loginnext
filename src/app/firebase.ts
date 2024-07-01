// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAysQnekgILiD_ymvSSdblXcDV1m0-OIm8",
  authDomain: "dawdwa-138d2.firebaseapp.com",
  projectId: "dawdwa-138d2",
  storageBucket: "dawdwa-138d2.appspot.com",
  messagingSenderId: "549589596543",
  appId: "1:549589596543:web:24304f862f9cfb04c9c24a"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }
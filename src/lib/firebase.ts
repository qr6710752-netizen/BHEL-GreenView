import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  "projectId": "bhel-greenview",
  "appId": "1:733981540067:web:232dc0dfa3cb46d8a1cfd6",
  "storageBucket": "bhel-greenview.firebasestorage.app",
  "apiKey": "AIzaSyADh_v0lq55Ojg-p6XZd6TEO-6cvp5bigs",
  "authDomain": "bhel-greenview.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "733981540067"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCX2_HtYMUuhVdrZgev3u4nhj3hyP9CHs",
  authDomain: "church-map-9fa6e.firebaseapp.com",
  projectId: "church-map-9fa6e",
  storageBucket: "church-map-9fa6e.appspot.com",
  messagingSenderId: "829085706213",
  appId: "1:829085706213:web:5bb4117233f19040e7310c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);
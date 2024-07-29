// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_API,
  authDomain: "estate-66e52.firebaseapp.com",
  projectId: "estate-66e52",
  storageBucket: "estate-66e52.appspot.com",
  messagingSenderId: "166328286196",
  appId: "1:166328286196:web:3ca6d155febee58345d7a1",
  measurementId: "G-TS0PMN39TC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
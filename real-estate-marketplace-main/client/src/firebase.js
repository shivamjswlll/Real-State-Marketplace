// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-bc23f.firebaseapp.com",
  projectId: "mern-estate-bc23f",
  storageBucket: "mern-estate-bc23f.appspot.com",
  messagingSenderId: "1071084769628",
  appId: "1:1071084769628:web:d12e4b58f9ec954ff5b199",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

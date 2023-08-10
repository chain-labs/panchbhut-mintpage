// Import the functions you need from the SDKs you need
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = !firebase.apps.length ? firebase.initializeApp({
  apiKey: "AIzaSyDkO6PlsMJ1Qo5_L2ZKcXPWQR7voj6_2Nc",
  authDomain: "panchbhoot-cedf9.firebaseapp.com",
  projectId: "panchbhoot-cedf9",
  storageBucket: "panchbhoot-cedf9.appspot.com",
  messagingSenderId: "1079317097987",
  appId: "1:1079317097987:web:b9ca9e419279417e696836",
  measurementId: "G-PZWVFVK271"
}):firebase.app();

// Initialize Firebase
export const db = app.firestore();
export default app;


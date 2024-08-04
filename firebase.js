// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBM9XfJdmyotl18ONU8SvsbK5PW4UgOG_4",
  authDomain: "inventory-management-4c244.firebaseapp.com",
  projectId: "inventory-management-4c244",
  storageBucket: "inventory-management-4c244.appspot.com",
  messagingSenderId: "930364873756",
  appId: "1:930364873756:web:8d86582a30b7bbba9e53d9",
  measurementId: "G-Y3DG500L8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const  firestore = getFirestore(app);

export {firestore}
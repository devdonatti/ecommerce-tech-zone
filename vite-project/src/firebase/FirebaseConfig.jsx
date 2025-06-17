// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEAuyVSeLLl-tbWOuoiLNbVBnmMS5wnnk",
  authDomain: "ecommerce-tech-zone.firebaseapp.com",
  projectId: "ecommerce-tech-zone",
  storageBucket: "ecommerce-tech-zone.firebasestorage.app",
  messagingSenderId: "568438303322",
  appId: "1:568438303322:web:6ed8ba1e67984cf0508663",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const auth = getAuth(app);

export { fireDB, auth };

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  setDoc,
  doc,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOFUs1R5lUmk3IDaxdCl0ZjuLxgONzgPQ",
  authDomain: "qrcode-glaben.firebaseapp.com",
  projectId: "qrcode-glaben",
  storageBucket: "qrcode-glaben.appspot.com",
  messagingSenderId: "216785836105",
  appId: "1:216785836105:web:7f642bc04bb41d066b4798",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, doc, addDoc, setDoc, getDocs, collection };

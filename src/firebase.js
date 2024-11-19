// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB8-nelgjhZB1viZz0Wh7B7DHPR0YlP34Q",
  authDomain: "myntra-9b279.firebaseapp.com",
  projectId: "myntra-9b279",
  storageBucket: "myntra-9b279.appspot.com",
  messagingSenderId: "133262293027",
  appId: "1:133262293027:web:c3e645b13a7ad1653b1996",
  measurementId: "G-ZG57GDLQV2"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp); // Initialize auth
const firestore = getFirestore(firebaseApp);

export { firebaseApp, auth, firestore };

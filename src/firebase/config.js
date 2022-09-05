import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.REACT_APP_FIREBASE_APP_ID
//   };
const firebaseConfig = {
  apiKey: "AIzaSyB0QTD7X8j__k0NR5oxSWYWa3iqDwsV6_8",
  authDomain: "projectmanagement-afk.firebaseapp.com",
  projectId: "projectmanagement-afk",
  storageBucket: "projectmanagement-afk.appspot.com",
  messagingSenderId: "784650190547",
  appId: "1:784650190547:web:771b3877a22bc00ef01e26"
};

//init firebase
const app = initializeApp(firebaseConfig);

//init storage
const storage = getStorage(app);
// init services
const firebaseDb = getFirestore(app);

// const auth = initializeAuth(app, { errorMap: debugErrorMap });
const firebaseAuth = getAuth(app);

export { firebaseDb, firebaseAuth, storage }
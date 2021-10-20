import { initializeApp } from 'firebase/app';
import { getFirestore,connectFirestoreEmulator} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider,connectAuthEmulator} from "firebase/auth";
import { getFunctions,connectFunctionsEmulator } from 'firebase/functions';







// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';


const firebaseConfig = {
    apiKey: "AIzaSyCo71zhRw7lzgQqfKzTvHsYi1KeW-DCXKg",
    authDomain: "poker-179e7.firebaseapp.com",
    projectId: "poker-179e7",
    storageBucket: "poker-179e7.appspot.com",
    messagingSenderId: "584071313294",
    appId: "1:584071313294:web:e292f189c3ac0eeaf716df",
    measurementId: "G-71G37R8E57"
  };
  
  

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider= new GoogleAuthProvider();
export const backendFunctions= getFunctions(app);

if (window.location.hostname === 'localhost') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFunctionsEmulator(backendFunctions, "localhost", 5001);
}







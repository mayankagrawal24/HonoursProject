import { initializeApp } from 'firebase/app';
import 'firebase/auth'
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAi8q9ImC8kdefedf1C-xs0UBtNmQXwo0g",
    authDomain: "honours-project-24ce1.firebaseapp.com",
    projectId: "honours-project-24ce1",
    storageBucket: "honours-project-24ce1.appspot.com",
    messagingSenderId: "255840834100",
    appId: "1:255840834100:web:06d6d48172a30c1a1af061",
    measurementId: "G-2DG9SFGR6B"
  };

// initalize firebase
const app = initializeApp(firebaseConfig);

export default app;
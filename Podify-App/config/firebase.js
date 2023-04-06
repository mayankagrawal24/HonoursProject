import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import Constants from 'expo-constants';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAi8q9ImC8kdefedf1C-xs0UBtNmQXwo0g",
    authDomain: "honours-project-24ce1.firebaseapp.com",
    projectId: "honours-project-24ce1",
    storageBucket: "honours-project-24ce1.appspot.com",
    messagingSenderId: "255840834100",
    appId: "1:255840834100:web:06d6d48172a30c1a1af061",
};

let Firebase;

if (firebase.apps.length === 0) {
  Firebase = firebase.initializeApp(firebaseConfig);
}

let HttpsFunctions = firebase.functions();
let FireStore = firebase.firestore();


export { Firebase, HttpsFunctions, FireStore};
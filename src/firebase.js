import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCRBOuZwSeDj4w3gNdSHu64s23NC22ilTg",
    authDomain: "adp-project-65d37.firebaseapp.com",
    projectId: "adp-project-65d37",
    storageBucket: "adp-project-65d37.appspot.com",
    messagingSenderId: "744986207734",
    appId: "1:744986207734:web:75bdd2039eccd0374a93d7"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();

// Create Firestore collections
export const announcementsCollection = firestore.collection('announcements');
export const portfoliosCollection = firestore.collection('portfolios');
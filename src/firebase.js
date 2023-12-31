import { initializeApp } from "firebase/app";
import {
	getFirestore,
	collection,
	addDoc,
	serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";

export const firebaseConfig = {
	apiKey: "AIzaSyCRBOuZwSeDj4w3gNdSHu64s23NC22ilTg",
	authDomain: "adp-project-65d37.firebaseapp.com",
	projectId: "adp-project-65d37",
	storageBucket: "adp-project-65d37.appspot.com",
	messagingSenderId: "744986207734",
	appId: "1:744986207734:web:75bdd2039eccd0374a93d7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app); // Export auth
const storage = getStorage(app);
const storageRef = ref(storage);

// Create Firestore collections

export const announcementsCollection = collection(firestore, "announcements");
export const portfoliosCollection = collection(firestore, "portfolios");
export const classSchedulesCollection = collection(firestore, "classSchedules");
export const profilesCollection = collection(firestore, "profiles");
export const subjectsCollection = collection(firestore, "subjects");
export const enrollmentsCollection = collection(firestore, "enrollments");
export const usersCollection = collection(firestore, "users");

export { app, firestore, auth, storage, storageRef };

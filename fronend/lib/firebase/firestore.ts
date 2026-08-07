import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./app";

export const getFirebaseDb = () => getFirestore(firebaseApp);

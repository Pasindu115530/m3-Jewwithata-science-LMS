import { getAuth } from "firebase/auth";
import { firebaseApp } from "./app";

export const getFirebaseAuth = () => getAuth(firebaseApp);

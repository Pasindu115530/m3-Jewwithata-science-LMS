import { firebaseApp } from "./firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

export const app = firebaseApp;

export const auth = typeof window !== "undefined" ? getAuth(app) : ({} as ReturnType<typeof getAuth>);
export const db = typeof window !== "undefined" ? getFirestore(app) : ({} as ReturnType<typeof getFirestore>);
export const storage = typeof window !== "undefined" ? getStorage(app) : ({} as ReturnType<typeof getStorage>);
export const functions = typeof window !== "undefined" ? getFunctions(app) : ({} as ReturnType<typeof getFunctions>);
import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";

// Initialize Firebase Admin SDK
initializeApp();

// Example HTTP function - customize as needed
export const helloWorld = onRequest((request, response) => {
  response.send("Hello from Firebase Cloud Functions!");
});

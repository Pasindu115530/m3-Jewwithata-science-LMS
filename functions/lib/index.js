"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = void 0;
const https_1 = require("firebase-functions/v2/https");
const app_1 = require("firebase-admin/app");
// Initialize Firebase Admin SDK
(0, app_1.initializeApp)();
// Example HTTP function - customize as needed
exports.helloWorld = (0, https_1.onRequest)((request, response) => {
    response.send("Hello from Firebase Cloud Functions!");
});
//# sourceMappingURL=index.js.map
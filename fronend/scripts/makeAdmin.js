const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));

initializeApp({
  credential: cert(serviceAccount),
});

const uid = "";

getAuth()
  .setCustomUserClaims(uid, {
    role: "admin",
  })
  .then(() => {
    console.log("✅ Admin role successfully assigned to UID:", uid);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error setting custom user claims:", err);
    process.exit(1);
  });
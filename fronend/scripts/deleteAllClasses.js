const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));
initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

async function deleteAllClasses() {
  console.log("Fetching all documents in 'classes' collection...");
  const snap = await db.collection("classes").get();
  
  if (snap.empty) {
    console.log("✅ Collection is already empty.");
    process.exit(0);
  }

  const batch = db.batch();
  snap.docs.forEach((docSnap) => {
    console.log(`🗑️  Deleting: ${docSnap.id} (${docSnap.data().grade || "no grade"} - ${docSnap.data().title || "no title"})`);
    batch.delete(docSnap.ref);
  });

  await batch.commit();
  console.log(`\n✅ Deleted ${snap.size} document(s). Firestore 'classes' collection is now empty.`);
  process.exit(0);
}

deleteAllClasses().catch((err) => {
  console.error("Error deleting classes:", err);
  process.exit(1);
});

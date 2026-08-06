const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "../serviceAccountKey.json"));
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const mockClasses = [
  {
    id: "class-grade-6-science",
    grade: "Grade 6",
    title: "06 ශ්‍රේණිය (Grade 6 Science)",
    dayOfWeek: "Friday",
    startTime: "03:30 PM",
    endTime: "05:30 PM",
    mode: "Physical",
    location: "Maharagama",
    fee: "LKR 2,200",
    createdAt: new Date().toISOString(),
  },
  {
    id: "class-grade-7-science",
    grade: "Grade 7",
    title: "07 ශ්‍රේණිය (Grade 7 Science)",
    dayOfWeek: "Thursday",
    startTime: "04:00 PM",
    endTime: "06:00 PM",
    mode: "Physical",
    location: "Maharagama",
    fee: "LKR 2,400",
    createdAt: new Date().toISOString(),
  },
  {
    id: "class-grade-8-science",
    grade: "Grade 8",
    title: "08 ශ්‍රේණිය (Grade 8 Science)",
    dayOfWeek: "Monday",
    startTime: "04:00 PM",
    endTime: "06:00 PM",
    mode: "Physical",
    location: "Nugegoda",
    fee: "LKR 2,500",
    createdAt: new Date().toISOString(),
  },
  {
    id: "class-grade-9-science",
    grade: "Grade 9",
    title: "09 ශ්‍රේණිය (Grade 9 Science)",
    dayOfWeek: "Wednesday",
    startTime: "05:00 PM",
    endTime: "07:00 PM",
    mode: "Online (Zoom)",
    location: "Zoom",
    fee: "LKR 2,800",
    createdAt: new Date().toISOString(),
  },
  {
    id: "class-grade-10-science",
    grade: "Grade 10",
    title: "10 ශ්‍රේණිය (Grade 10 Science)",
    dayOfWeek: "Saturday",
    startTime: "08:30 AM",
    endTime: "11:00 AM",
    mode: "Physical",
    location: "Maharagama",
    fee: "LKR 3,200",
    createdAt: new Date().toISOString(),
  },
  {
    id: "class-grade-11-science",
    grade: "Grade 11",
    title: "11 ශ්‍රේණිය (Grade 11 Science)",
    dayOfWeek: "Sunday",
    startTime: "01:30 PM",
    endTime: "04:30 PM",
    mode: "Hybrid",
    location: "Maharagama + Zoom",
    fee: "LKR 3,500",
    createdAt: new Date().toISOString(),
  },
];

async function seedClasses() {
  console.log("Seeding classes to Firestore...");
  for (const c of mockClasses) {
    const { id, ...data } = c;
    await db.collection("classes").doc(id).set(data, { merge: true });
    console.log(`✅ Seeded ${c.grade}: ${c.title} (ID: ${id})`);
  }
  console.log("Seeding completed successfully!");
  process.exit(0);
}

seedClasses().catch((err) => {
  console.error("Error seeding classes:", err);
  process.exit(1);
});

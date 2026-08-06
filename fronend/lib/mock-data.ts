// ── Public website class schedule display ────────────────────────────────────
// Used ONLY on public pages (homepage, /classes, /timetable) for display.
// The LMS student portal reads classes from Firestore (added by the teacher).
export const classes = [
  { grade: "Grade 6", title: "Science Foundation", fullTitle: "06 ශ්‍රේණිය (Grade 6 Science)", day: "Friday", time: "3:30 PM – 5:30 PM", mode: "Physical", location: "Maharagama", fee: "LKR 2,200", seats: 16, titleImage: "/images/courses/g6title.png",
    paperClass: { name: "Smart Science Paper Class", status: "Active", schedule: "සඳුදා ප.ව 6.30 (Monday 6.30 PM)" },
    theoryClass: { name: "Smart Science Theory Class", status: "Coming Soon", note: "දේශන කාලසටහන ළඟදීම බලාපොරොත්තුවන්න." } },
  { grade: "Grade 7", title: "Science Explorer", fullTitle: "07 ශ්‍රේණිය (Grade 7 Science)", day: "Thursday", time: "4:00 PM – 6:00 PM", mode: "Physical", location: "Maharagama", fee: "LKR 2,400", seats: 18, titleImage: "/images/courses/g7title.png",
    paperClass: { name: "Smart Science Paper Class", status: "Active", schedule: "සඳුදා ප.ව 8.00 (Monday 8.00 PM)" },
    theoryClass: { name: "Smart Science Theory Class", status: "Coming Soon", note: "දේශන කාලසටහන ළඟදීම බලාපොරොත්තුවන්න." } },
  { grade: "Grade 8", title: "Science Theory", fullTitle: "08 ශ්‍රේණිය (Grade 8 Science)", day: "Monday", time: "4:00 PM – 6:00 PM", mode: "Physical", location: "Nugegoda", fee: "LKR 2,500", seats: 14, titleImage: "/images/courses/g8title.png",
    paperClass: { name: "Smart Science Paper Class", status: "Active", schedule: "ඉරිදා ප.ව 8.00 (Sunday 8.00 PM)" },
    theoryClass: { name: "Smart Science Theory Class", status: "Coming Soon", note: "දේශන කාලසටහන ළඟදීම බලාපොරොත්තුවන්න." } },
  { grade: "Grade 9", title: "Revision + Papers", fullTitle: "09 ශ්‍රේණිය (Grade 9 Science)", day: "Wednesday", time: "5:00 PM – 7:00 PM", mode: "Online", location: "Zoom", fee: "LKR 2,800", seats: 21, titleImage: "/images/courses/g9title.png",
    paperClass: { name: "Smart Science Paper Class", status: "Active", schedule: "බදාදා ප.ව 6.30 (Wednesday 6.30 PM)" },
    theoryClass: { name: "Smart Science Theory Class", status: "Coming Soon", note: "දේශන කාලසටහන ළඟදීම බලාපොරොත්තුවන්න." } },
  { grade: "Grade 10", title: "O/L Science", fullTitle: "10 ශ්‍රේණිය (Grade 10 Science)", day: "Saturday", time: "8:30 AM – 11:00 AM", mode: "Physical", location: "Maharagama", fee: "LKR 3,200", seats: 8, titleImage: "/images/courses/g10title.png",
    paperClass: { name: "Smart Science Paper Class", status: "Active", schedule: "සෙනසුරාදා පෙ.ව 8.30 (Saturday 8.30 AM)" },
    theoryClass: { name: "Smart Science Theory Class", status: "Coming Soon", note: "දේශන කාලසටහන ළඟදීම බලාපොරොත්තුවන්න." } },
  { grade: "Grade 11", title: "Final Paper Class", fullTitle: "11 ශ්‍රේණිය (Grade 11 Science)", day: "Sunday", time: "1:30 PM – 4:30 PM", mode: "Hybrid", location: "Maharagama + Zoom", fee: "LKR 3,500", seats: 5, titleImage: "/images/courses/g11title.png",
    paperClass: { name: "Smart Science Paper Class", status: "Active", schedule: "ඉරිදා ප.ව 1.30 (Sunday 1.30 PM)" },
    theoryClass: { name: "Smart Science Theory Class", status: "Coming Soon", note: "දේශන කාලසටහන ළඟදීම බලාපොරොත්තුවන්න." } },                                                                     
];

export const lessons = [
  { title: "Cells and Living Systems", grade: "Grade 8", topic: "Biology", duration: "18 min", icon: "🧬" },
  { title: "Force, Work and Energy", grade: "Grade 9", topic: "Physics", duration: "24 min", icon: "⚙️" },
  { title: "Acids, Bases and Salts", grade: "Grade 10", topic: "Chemistry", duration: "31 min", icon: "🧪" },
];

export const announcements = [
  { title: "Grade 11 model paper seminar", date: "03 Aug 2026", category: "Seminar", priority: "Featured" },
  { title: "Wednesday online class starts at 5:30 PM", date: "30 Jul 2026", category: "Classes", priority: "Update" },
  { title: "Assignment 06 submission deadline", date: "01 Aug 2026", category: "Assignments", priority: "Reminder" },
];

export const testimonials = [
  { name: "Nethmi S.", grade: "Grade 10", text: "Sir explains difficult lessons with simple examples. My term-test mark improved from 61 to 84.", rating: 5 },
  { name: "Parent of Kavindu", grade: "Grade 9", text: "The progress updates and weekly assignments help us understand exactly where our child needs support.", rating: 5 },
  { name: "Dinuka P.", grade: "Grade 11", text: "The paper discussions are clear, organised and focused on the mistakes students usually make.", rating: 5 },
];

export const studentMenu = [
  ["My Courses", "/student/courses"],
  ["Live Classes", "/student/live-classes"],
  ["Payments", "/student/payments"],
  ["Payment History", "/student/payment-history"],
  ["Profile", "/student/profile"]
] as const;

export const teacherMenu = [
  ["Dashboard", "/teacher/dashboard"], ["Today’s Classes", "/teacher/classes"], ["Zoom Links", "/teacher/zoom-links"], ["Students", "/teacher/students"],
  ["Attendance", "/teacher/attendance"], ["Weekly Timetable", "/teacher/timetable"], ["Assignments", "/teacher/assignments"],
  ["Payment Approvals", "/teacher/payments"], ["Announcements", "/teacher/announcements"], ["Profile", "/teacher/profile"],
  ["Settings", "/teacher/settings"]
] as const;



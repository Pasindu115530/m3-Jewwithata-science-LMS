export const classes = [
  { grade: "Grade 8", title: "Science Theory", day: "Monday", time: "4:00 PM – 6:00 PM", mode: "Physical", location: "Nugegoda", fee: "LKR 2,500", seats: 14 },
  { grade: "Grade 9", title: "Revision + Papers", day: "Wednesday", time: "5:00 PM – 7:00 PM", mode: "Online", location: "Zoom", fee: "LKR 2,800", seats: 21 },
  { grade: "Grade 10", title: "O/L Science", day: "Saturday", time: "8:30 AM – 11:00 AM", mode: "Physical", location: "Maharagama", fee: "LKR 3,200", seats: 8 },
  { grade: "Grade 11", title: "Final Paper Class", day: "Sunday", time: "1:30 PM – 4:30 PM", mode: "Hybrid", location: "Maharagama + Zoom", fee: "LKR 3,500", seats: 5 },
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
  ["Dashboard", "/student/dashboard"], ["Free Lessons", "/student/free-lessons"], ["Weekly Timetable", "/student/timetable"],
  ["Live Classes", "/student/live-classes"], ["Assignments", "/student/assignments"], ["Payments", "/student/payments"],
  ["Payment History", "/student/payment-history"], ["Attendance", "/student/attendance"], ["Notifications", "/student/notifications"],
  ["Profile", "/student/profile"], ["Settings", "/student/settings"]
] as const;

export const teacherMenu = [
  ["Dashboard", "/teacher/dashboard"], ["Today’s Classes", "/teacher/classes"], ["Zoom Links", "/teacher/zoom-links"], ["Students", "/teacher/students"],
  ["Attendance", "/teacher/attendance"], ["Weekly Timetable", "/teacher/timetable"], ["Assignments", "/teacher/assignments"],
  ["Payment Approvals", "/teacher/payments"], ["Announcements", "/teacher/announcements"], ["Profile", "/teacher/profile"],
  ["Settings", "/teacher/settings"]
] as const;

export const adminMenu = [
  ["Dashboard", "/admin/dashboard"], ["Students", "/admin/students"], ["Today's Classes", "/teacher/classes"],
  ["Zoom Links", "/teacher/zoom-links"], ["Payment Approvals", "/teacher/payments"], ["Announcements", "/teacher/announcements"],
  ["Settings", "/teacher/settings"]
] as const;

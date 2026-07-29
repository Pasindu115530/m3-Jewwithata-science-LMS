export type UserRole = 'student' | 'teacher' | 'public';

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  stream: string;
  studentId: string;
  email: string;
  attendanceRate: number;
  completedLabs: number;
  totalLabs: number;
  pendingAssignments: number;
  upcomingQuizzes: number;
  unpaidFees: number;
}

export interface TeacherProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  subject: string;
  email: string;
  activeStudents: number;
  classesToday: number;
  pendingApprovals: number;
}

export interface PracticalLesson {
  id: string;
  title: string;
  subject: 'Chemistry' | 'Physics' | 'Biology';
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  description: string;
  isFree: boolean;
  videoUrl?: string;
  labType: 'titration' | 'optics' | 'pendulum' | 'dna';
  completed?: boolean;
}

export interface ZoomClass {
  id: string;
  title: string;
  subject: string;
  teacherName: string;
  teacherAvatar: string;
  time: string;
  date: string;
  durationMinutes: number;
  isLiveNow: boolean;
  meetingLink: string;
  attendeesCount: number;
  prerequisites: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  status: 'Pending' | 'Submitted' | 'Graded' | 'Overdue';
  score?: string;
  description: string;
  teacherNote?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  totalQuestions: number;
  durationMinutes: number;
  scheduledDate: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
  lastScore?: number;
}

export interface PaymentInvoice {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Awaiting Approval';
  paidDate?: string;
  paymentMethod?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  time: string;
  studentName?: string;
  studentId?: string;
}

export interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  subject: string;
  topic: string;
  teacher: string;
  room: string;
  color: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type: 'live' | 'assignment' | 'payment' | 'announcement';
  read: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Chemistry' | 'Physics' | 'Biology' | 'Science Fair';
  imageUrl: string;
  date: string;
  likes: number;
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  category: string;
}

import {
  StudentProfile,
  TeacherProfile,
  PracticalLesson,
  ZoomClass,
  Assignment,
  Quiz,
  PaymentInvoice,
  AttendanceRecord,
  TimetableEntry,
  NotificationItem,
  GalleryItem,
  TaskItem
} from '../types';

export const mockStudent: StudentProfile = {
  id: 'std_101',
  name: 'Mia Sharma',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  grade: 'Grade 12',
  stream: 'Advanced Science Stream',
  studentId: 'SCI-2026-8842',
  email: 'mia.sharma@sciencepractical.edu',
  attendanceRate: 94.5,
  completedLabs: 18,
  totalLabs: 24,
  pendingAssignments: 2,
  upcomingQuizzes: 1,
  unpaidFees: 45
};

export const mockTeacher: TeacherProfile = {
  id: 'tch_201',
  name: 'Prof. Sarah Jenkins',
  title: 'Lead Chemistry & Optics Specialist',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  subject: 'Chemistry & Physics Practicals',
  email: 'sarah.jenkins@sciencepractical.edu',
  activeStudents: 128,
  classesToday: 4,
  pendingApprovals: 3
};

export const mockLessons: PracticalLesson[] = [
  {
    id: 'les_1',
    title: 'Acid-Base Titration & Indicator Reactions',
    subject: 'Chemistry',
    duration: '45 mins',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600',
    description: 'Learn how to determine the concentration of unknown HCl solution using standard NaOH and phenolphthalein indicator.',
    isFree: true,
    labType: 'titration',
    completed: true
  },
  {
    id: 'les_2',
    title: 'Light Refraction & Convex Lens Optics',
    subject: 'Physics',
    duration: '35 mins',
    difficulty: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600',
    description: 'Investigate Snell’s Law, critical angle, and image formation in convex lenses using virtual ray optics.',
    isFree: true,
    labType: 'optics',
    completed: true
  },
  {
    id: 'les_3',
    title: 'Simple Harmonic Motion & Pendulum Oscillation',
    subject: 'Physics',
    duration: '40 mins',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600',
    description: 'Calculate gravitational acceleration (g) by plotting period squared T² against length L of a simple pendulum.',
    isFree: false,
    labType: 'pendulum',
    completed: false
  },
  {
    id: 'les_4',
    title: 'DNA Extraction & Gel Electrophoresis',
    subject: 'Biology',
    duration: '50 mins',
    difficulty: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=600',
    description: 'Extract strawberry plant DNA using detergent and alcohol, then isolate fragments via agarose gel electrophoresis.',
    isFree: true,
    labType: 'dna',
    completed: false
  }
];

export const mockZoomClasses: ZoomClass[] = [
  {
    id: 'zoom_1',
    title: 'Organic Chemistry Reactions & Mechanisms Live Lab',
    subject: 'Chemistry Practical',
    teacherName: 'Prof. Sarah Jenkins',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    time: '10:30 AM',
    date: 'Today',
    durationMinutes: 60,
    isLiveNow: true,
    meetingLink: 'https://zoom.us/j/mock-science-lms-1234',
    attendeesCount: 42,
    prerequisites: 'Bring Lab Worksheet #4 and safety goggles protocol notes.'
  },
  {
    id: 'zoom_2',
    title: 'Physics Optics & Laser Interference Experiment',
    subject: 'Physics Practical',
    teacherName: 'Dr. Robert Vance',
    teacherAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    time: '02:00 PM',
    date: 'Today',
    durationMinutes: 45,
    isLiveNow: false,
    meetingLink: 'https://zoom.us/j/mock-science-lms-5678',
    attendeesCount: 38,
    prerequisites: 'Graph paper and protractor recommended for live calculations.'
  },
  {
    id: 'zoom_3',
    title: 'Microbiology Staining & Cell Structure Microscopic Analysis',
    subject: 'Biology Practical',
    teacherName: 'Dr. Elena Rostova',
    teacherAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    time: '09:00 AM',
    date: 'Tomorrow',
    durationMinutes: 60,
    isLiveNow: false,
    meetingLink: 'https://zoom.us/j/mock-science-lms-9900',
    attendeesCount: 50,
    prerequisites: 'Download microscope slide reference PDF before class.'
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: 'asg_1',
    title: 'Titration Lab Report & Stoichiometric Error Analysis',
    subject: 'Chemistry',
    dueDate: '2026-07-30',
    dueTime: '11:59 PM',
    status: 'Pending',
    description: 'Submit your calculated molarity tables along with standard deviation analysis for the NaOH titration trial runs.'
  },
  {
    id: 'asg_2',
    title: 'Optics Ray Diagram Calculations & Critical Angle Graph',
    subject: 'Physics',
    dueDate: '2026-08-01',
    dueTime: '05:00 PM',
    status: 'Pending',
    description: 'Plot 1/v vs 1/u graph for convex lens focal length determination and answer synthesis questions.'
  },
  {
    id: 'asg_3',
    title: 'Microscope Cell Observation Worksheet #2',
    subject: 'Biology',
    dueDate: '2026-07-25',
    dueTime: '04:00 PM',
    status: 'Graded',
    score: '96/100',
    description: 'Diagram onion epidermal cells and cheek epithelial cells under 40x magnification.',
    teacherNote: 'Excellent cell wall labeling! Clear resolution in diagrams.'
  }
];

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz_1',
    title: 'Optics & Wave Refraction Practical Quiz',
    subject: 'Physics',
    totalQuestions: 10,
    durationMinutes: 15,
    scheduledDate: '2026-07-29 (Tomorrow)',
    status: 'Upcoming'
  },
  {
    id: 'quiz_2',
    title: 'Chemical Indicators & Buffer Solutions Test',
    subject: 'Chemistry',
    totalQuestions: 15,
    durationMinutes: 20,
    scheduledDate: '2026-07-24',
    status: 'Completed',
    lastScore: 92
  }
];

export const mockPayments: PaymentInvoice[] = [
  {
    id: 'pay_1',
    invoiceNumber: 'INV-2026-088',
    description: 'July Term Science Practical Lab Equipment & Zoom Access Fee',
    amount: 45,
    dueDate: '2026-07-31',
    status: 'Pending'
  },
  {
    id: 'pay_2',
    invoiceNumber: 'INV-2026-052',
    description: 'June Term Chemistry Chemicals & Safety Pack',
    amount: 50,
    dueDate: '2026-06-30',
    status: 'Paid',
    paidDate: '2026-06-28',
    paymentMethod: 'Credit Card (Stripe)'
  },
  {
    id: 'pay_3',
    invoiceNumber: 'INV-2026-019',
    description: 'May Term Physics Practical Optics Kit',
    amount: 45,
    dueDate: '2026-05-31',
    status: 'Paid',
    paidDate: '2026-05-25',
    paymentMethod: 'Bank Transfer'
  }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  { id: 'att_1', date: '2026-07-28', subject: 'Chemistry Titration', status: 'Present', time: '10:30 AM', studentName: 'Mia Sharma' },
  { id: 'att_2', date: '2026-07-27', subject: 'Physics Optics', status: 'Present', time: '02:00 PM', studentName: 'Mia Sharma' },
  { id: 'att_3', date: '2026-07-26', subject: 'Biology Genetics', status: 'Present', time: '09:00 AM', studentName: 'Mia Sharma' },
  { id: 'att_4', date: '2026-07-23', subject: 'Physics Mechanics', status: 'Late', time: '02:15 PM', studentName: 'Mia Sharma' },
  { id: 'att_5', date: '2026-07-21', subject: 'Chemistry Calorimetry', status: 'Present', time: '10:30 AM', studentName: 'Mia Sharma' }
];

export const mockTimetable: TimetableEntry[] = [
  { id: 'tt_1', day: 'Monday', time: '09:00 AM - 10:30 AM', subject: 'Chemistry', topic: 'Titration Lab & pH Curves', teacher: 'Prof. Sarah Jenkins', room: 'Lab Room A', color: 'bg-purple-100 text-purple-700' },
  { id: 'tt_2', day: 'Monday', time: '11:00 AM - 12:30 PM', subject: 'Physics', topic: 'Lenses & Refraction', teacher: 'Dr. Robert Vance', room: 'Physics Optics Bay', color: 'bg-blue-100 text-blue-700' },
  { id: 'tt_3', day: 'Tuesday', time: '10:30 AM - 12:00 PM', subject: 'Chemistry', topic: 'Organic Reactions Live Zoom', teacher: 'Prof. Sarah Jenkins', room: 'Zoom Virtual Room 1', color: 'bg-pink-100 text-pink-700' },
  { id: 'tt_4', day: 'Wednesday', time: '09:00 AM - 10:30 AM', subject: 'Biology', topic: 'DNA Isolation Practical', teacher: 'Dr. Elena Rostova', room: 'BioLab 3', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'tt_5', day: 'Thursday', time: '02:00 PM - 03:30 PM', subject: 'Physics', topic: 'Pendulum Oscillation & Gravity', teacher: 'Dr. Robert Vance', room: 'Mechanics Lab', color: 'bg-amber-100 text-amber-700' },
  { id: 'tt_6', day: 'Friday', time: '10:00 AM - 11:30 AM', subject: 'General Science', topic: 'Weekly Practical Quiz & Review', teacher: 'Panel Teachers', room: 'Main Lecture Hall', color: 'bg-indigo-100 text-indigo-700' }
];

export const mockNotifications: NotificationItem[] = [
  { id: 'not_1', title: 'Live Class Starting Soon', message: 'Organic Chemistry Reactions Zoom starts in 15 minutes.', timeAgo: '5m ago', type: 'live', read: false },
  { id: 'not_2', title: 'Assignment Graded', message: 'Your Biology Cell Worksheet #2 scored 96/100.', timeAgo: '2h ago', type: 'assignment', read: false },
  { id: 'not_3', title: 'Payment Reminder', message: 'July term fee of $45 is due on July 31.', timeAgo: '1d ago', type: 'payment', read: true },
  { id: 'not_4', title: 'New Lab Added', message: 'DNA Gel Electrophoresis interactive lab simulator is now live!', timeAgo: '2d ago', type: 'announcement', read: true }
];

export const mockGallery: GalleryItem[] = [
  { id: 'gal_1', title: 'Flame Test Spectral Analysis', category: 'Chemistry', imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800', date: 'Jul 24, 2026', likes: 142 },
  { id: 'gal_2', title: 'Laser Diffraction Pattern', category: 'Physics', imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800', date: 'Jul 22, 2026', likes: 98 },
  { id: 'gal_3', title: 'Plant Tissue Cell Division', category: 'Biology', imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800', date: 'Jul 20, 2026', likes: 210 },
  { id: 'gal_4', title: 'National Science Fair Winner Project', category: 'Science Fair', imageUrl: 'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?auto=format&fit=crop&q=80&w=800', date: 'Jul 15, 2026', likes: 350 }
];

export const mockTasks: TaskItem[] = [
  { id: 'tsk_1', text: 'Complete Titration Virtual Experiment', completed: true, category: 'Chemistry' },
  { id: 'tsk_2', text: 'Submit Optics Ray Diagram Worksheet', completed: false, category: 'Physics' },
  { id: 'tsk_3', text: 'Join 10:30 AM Organic Chemistry Zoom Class', completed: false, category: 'Live Class' },
  { id: 'tsk_4', text: 'Review Physics Optics Quiz Questions', completed: false, category: 'Quiz Prep' }
];

export const weeklyLearningChartData = [
  { day: 'Mon', hours: 2.5, labs: 2 },
  { day: 'Tue', hours: 3.8, labs: 3 },
  { day: 'Wed', hours: 2.0, labs: 1 },
  { day: 'Thu', hours: 4.2, labs: 4 },
  { day: 'Fri', hours: 3.0, labs: 2 },
  { day: 'Sat', hours: 5.1, labs: 5 },
  { day: 'Sun', hours: 1.8, labs: 1 }
];

export const attendanceChartData = [
  { name: 'Present', value: 94.5, color: '#8B5CF6' },
  { name: 'Late', value: 3.5, color: '#FBA585' },
  { name: 'Absent', value: 2.0, color: '#F472B6' }
];

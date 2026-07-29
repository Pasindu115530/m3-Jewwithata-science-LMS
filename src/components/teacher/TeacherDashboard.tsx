'use client';

import React, { useState } from 'react';
import {
  Video,
  Users,
  CheckSquare,
  CreditCard,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Calendar,
  Sparkles,
  FileText,
  Clock,
  Search,
  Check
} from 'lucide-react';
import {
  mockTeacher,
  mockZoomClasses,
  mockAttendanceRecords,
  mockPayments
} from '../../data/mockData';

interface TeacherDashboardProps {
  onOpenZoomModal: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onOpenZoomModal }) => {
  // Student roster state
  const [studentsList, setStudentsList] = useState([
    { id: '1', name: 'Mia Sharma', grade: 'Grade 12', stream: 'Chemistry/Physics', attendance: '96%', feesStatus: 'Paid' },
    { id: '2', name: 'Alex Vance', grade: 'Grade 12', stream: 'Physics/Maths', attendance: '92%', feesStatus: 'Pending' },
    { id: '3', name: 'Ethan Miller', grade: 'Grade 11', stream: 'Biology/Chemistry', attendance: '98%', feesStatus: 'Paid' },
    { id: '4', name: 'Sophia Zhang', grade: 'Grade 12', stream: 'Chemistry/Physics', attendance: '94%', feesStatus: 'Paid' },
    { id: '5', name: 'Noah Patel', grade: 'Grade 11', stream: 'Physics/Chemistry', attendance: '90%', feesStatus: 'Pending' }
  ]);

  // Modal states
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('Grade 12');

  const [showCreateTestModal, setShowCreateTestModal] = useState(false);
  const [testTitle, setTestTitle] = useState('');
  const [testSubject, setTestSubject] = useState('Chemistry');

  // Payment approvals state
  const [paymentsList, setPaymentsList] = useState(mockPayments);

  // Attendance toggles
  const [attendanceRecords, setAttendanceRecords] = useState(mockAttendanceRecords);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    setStudentsList(prev => [
      ...prev,
      {
        id: String(Date.now()),
        name: newStudentName,
        grade: newStudentGrade,
        stream: 'Science Practical',
        attendance: '100%',
        feesStatus: 'Paid'
      }
    ]);
    setNewStudentName('');
    setShowAddStudentModal(false);
  };

  const handleDeleteStudent = (id: string) => {
    setStudentsList(prev => prev.filter(s => s.id !== id));
  };

  const handleApprovePayment = (id: string) => {
    setPaymentsList(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'Paid', paidDate: 'Today (Approved)' } : p))
    );
  };

  const handleRejectPayment = (id: string) => {
    setPaymentsList(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'Overdue' } : p))
    );
  };

  const toggleAttendanceStatus = (id: string) => {
    setAttendanceRecords(prev =>
      prev.map(a => {
        if (a.id === id) {
          const nextStatus = a.status === 'Present' ? 'Absent' : a.status === 'Absent' ? 'Late' : 'Present';
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP BANNER */}
      <div className="clay-card-purple p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Teacher Administration Control Center</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Welcome Back, {mockTeacher.name} 🔬
          </h2>

          <p className="text-xs sm:text-sm text-purple-100 font-medium">
            You have 4 Zoom practical sessions scheduled today and 3 pending payment approvals awaiting review.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenZoomModal}
              className="px-5 py-2.5 rounded-full bg-white text-purple-900 font-extrabold text-xs shadow-md hover:bg-purple-50 transition flex items-center gap-2"
            >
              <Video className="w-4 h-4 text-purple-600" />
              <span>Start Zoom Practical Session</span>
            </button>

            <button
              onClick={() => setShowCreateTestModal(true)}
              className="px-5 py-2.5 rounded-full bg-purple-900/40 text-white border border-white/40 font-bold text-xs hover:bg-purple-900/60 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Test / Quiz</span>
            </button>
          </div>
        </div>

        <div className="relative w-full md:w-56 h-36 rounded-2xl overflow-hidden border-2 border-white/40 shadow-xl shrink-0">
          <img
            src={mockTeacher.avatar}
            alt={mockTeacher.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 2. STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="clay-card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-500 uppercase">Today's Classes</p>
            <p className="text-3xl font-black text-purple-950 mt-1">4 Classes</p>
            <p className="text-[11px] text-purple-600 font-semibold mt-1">128 Total Students</p>
          </div>
          <div className="clay-badge-icon bg-purple-100 text-purple-600">
            <Video className="w-6 h-6" />
          </div>
        </div>

        <div className="clay-card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-500 uppercase">Active Students</p>
            <p className="text-3xl font-black text-purple-950 mt-1">128</p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">+12 this month</p>
          </div>
          <div className="clay-badge-icon bg-indigo-100 text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="clay-card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-500 uppercase">Attendance Rate</p>
            <p className="text-3xl font-black text-purple-950 mt-1">96%</p>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">High Engagement</p>
          </div>
          <div className="clay-badge-icon bg-teal-100 text-teal-600">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="clay-card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-500 uppercase">Pending Approvals</p>
            <p className="text-3xl font-black text-purple-950 mt-1">3 Slips</p>
            <p className="text-[11px] text-amber-600 font-bold mt-1">Action Required</p>
          </div>
          <div className="clay-badge-icon bg-amber-100 text-amber-600">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. MANAGEMENT TABLES SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Student Roster Table */}
        <div className="lg:col-span-7 clay-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-purple-950">Student Roster Management</h3>
              <p className="text-xs text-purple-500">Add, edit or filter enrolled practical students</p>
            </div>
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="clay-btn px-4 py-2 text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Student
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-100 text-purple-400 font-extrabold uppercase">
                  <th className="pb-3 pl-2">Student</th>
                  <th className="pb-3">Grade</th>
                  <th className="pb-3">Attendance</th>
                  <th className="pb-3">Fees</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {studentsList.map((st) => (
                  <tr key={st.id} className="hover:bg-purple-50/50 transition">
                    <td className="py-3 pl-2 font-bold text-purple-950">{st.name}</td>
                    <td className="py-3 text-purple-700">{st.grade}</td>
                    <td className="py-3 text-emerald-600 font-bold">{st.attendance}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        st.feesStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {st.feesStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-2">
                      <button
                        onClick={() => handleDeleteStudent(st.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Approvals Table */}
        <div className="lg:col-span-5 clay-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-purple-950">Payment Approval Slips</h3>
              <p className="text-xs text-purple-500">Review student fee payment receipts</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
              3 Review
            </span>
          </div>

          <div className="space-y-3">
            {paymentsList.map((pay) => (
              <div key={pay.id} className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-2xs flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-xs text-purple-950">{pay.invoiceNumber} • ${pay.amount}</p>
                  <p className="text-[10px] text-purple-500 line-clamp-1">{pay.description}</p>
                  <p className="text-[10px] font-bold text-purple-700 mt-0.5">Status: {pay.status}</p>
                </div>

                {pay.status === 'Pending' ? (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleApprovePayment(pay.id)}
                      className="p-1.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-bold transition flex items-center gap-1"
                      title="Approve Slip"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleRejectPayment(pay.id)}
                      className="p-1.5 rounded-xl bg-rose-100 text-rose-600 hover:bg-rose-200 text-xs font-bold transition"
                      title="Reject Slip"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold shrink-0">
                    {pay.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. TODAY'S CLASSES & ATTENDANCE RECORDING */}
      <div className="clay-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-purple-950">Today's Class Attendance Marker</h3>
            <p className="text-xs text-purple-500">Click student status pill to cycle between Present, Absent, and Late</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {attendanceRecords.map((att) => (
            <div key={att.id} className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-purple-950">{att.studentName}</p>
                <p className="text-[10px] text-purple-500">{att.subject} • {att.time}</p>
              </div>

              <button
                onClick={() => toggleAttendanceStatus(att.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  att.status === 'Present'
                    ? 'bg-emerald-500 text-white'
                    : att.status === 'Late'
                    ? 'bg-amber-400 text-purple-950'
                    : 'bg-rose-500 text-white'
                }`}
              >
                {att.status}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: ADD STUDENT */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-purple-100">
            <h3 className="font-black text-lg text-purple-950">Add New Student</h3>
            <form onSubmit={handleAddStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Smith"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">Grade / Level</label>
                <select
                  value={newStudentGrade}
                  onChange={(e) => setNewStudentGrade(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs outline-none font-bold"
                >
                  <option value="Grade 11">Grade 11 Science</option>
                  <option value="Grade 12">Grade 12 Science</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-purple-700 bg-purple-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="clay-btn px-5 py-2 text-xs font-bold"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE TEST */}
      {showCreateTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-purple-100">
            <h3 className="font-black text-lg text-purple-950">Create Science Quiz / Practical Test</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowCreateTestModal(false);
                alert(`Practical Quiz "${testTitle || 'Chemistry Test'}" created and published to students!`);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">Test Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Optics & Wave Interference Quiz"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-900 mb-1">Subject</label>
                <select
                  value={testSubject}
                  onChange={(e) => setTestSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs outline-none font-bold"
                >
                  <option value="Chemistry">Chemistry Practical</option>
                  <option value="Physics">Physics Practical</option>
                  <option value="Biology">Biology Practical</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTestModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-purple-700 bg-purple-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="clay-btn px-5 py-2 text-xs font-bold"
                >
                  Publish Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

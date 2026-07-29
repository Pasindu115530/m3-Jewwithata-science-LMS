'use client';

import React, { useState } from 'react';
import { FileCheck, Upload, CheckCircle, Clock, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { mockAssignments } from '../../data/mockData';

export const AssignmentsModule: React.FC = () => {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const handleSimulateUpload = (id: string) => {
    setUploadingId(id);
    setTimeout(() => {
      setAssignments(prev =>
        prev.map(a =>
          a.id === id
            ? { ...a, status: 'Submitted', teacherNote: 'Worksheet received! Teacher grading in progress.' }
            : a
        )
      );
      setUploadingId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="clay-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase">
              Lab Reports & Worksheets
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-purple-950 mt-1">
              Practical Assignments
            </h2>
            <p className="text-xs text-purple-600 font-medium">Upload completed titration calculations, ray diagrams, and graphs</p>
          </div>
        </div>

        <div className="space-y-4">
          {assignments.map((asg) => (
            <div
              key={asg.id}
              className="p-6 rounded-3xl bg-white border border-purple-100 shadow-2xs space-y-4 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-purple-50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="clay-badge-icon bg-purple-100 text-purple-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-extrabold uppercase">
                      {asg.subject}
                    </span>
                    <h3 className="font-extrabold text-base text-purple-950 mt-1">{asg.title}</h3>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  asg.status === 'Graded'
                    ? 'bg-emerald-100 text-emerald-800'
                    : asg.status === 'Submitted'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  Status: {asg.status} {asg.score && `(${asg.score})`}
                </span>
              </div>

              <p className="text-xs text-purple-800/80 leading-relaxed font-medium">
                {asg.description}
              </p>

              {asg.teacherNote && (
                <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 text-xs text-purple-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold">Teacher Feedback: </span>
                    <span>{asg.teacherNote}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <span className="text-xs text-purple-500 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Due Date: {asg.dueDate} at {asg.dueTime}
                </span>

                {asg.status === 'Pending' && (
                  <button
                    disabled={uploadingId === asg.id}
                    onClick={() => handleSimulateUpload(asg.id)}
                    className="clay-btn px-5 py-2.5 text-xs font-bold flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploadingId === asg.id ? 'Uploading Worksheet PDF...' : 'Upload PDF Worksheet'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

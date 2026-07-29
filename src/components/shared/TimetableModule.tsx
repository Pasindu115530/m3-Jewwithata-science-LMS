'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, Video, ExternalLink } from 'lucide-react';
import { mockTimetable } from '../../data/mockData';

interface TimetableModuleProps {
  onOpenZoomModal: () => void;
}

export const TimetableModule: React.FC<TimetableModuleProps> = ({ onOpenZoomModal }) => {
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

  const filteredEntries = mockTimetable.filter(t => t.day === selectedDay);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="clay-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-extrabold uppercase">
              Practical Class Schedule
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-purple-950 mt-1">
              Weekly Timetable
            </h2>
            <p className="text-xs text-purple-600 font-medium">Grade 12 Science Stream • Term 3 Live Practicals</p>
          </div>

          <button
            onClick={onOpenZoomModal}
            className="clay-btn px-5 py-2.5 text-xs font-bold flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            <span>Join Active Zoom Practical</span>
          </button>
        </div>

        {/* Day Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                selectedDay === day
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Schedule List */}
        <div className="space-y-4">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-5 rounded-3xl bg-white border border-purple-100/90 shadow-2xs hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`px-3 py-2 rounded-2xl text-xs font-extrabold ${entry.color} border border-current/20 shrink-0`}>
                    {entry.subject}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-purple-950">{entry.topic}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-purple-600/80 mt-1">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {entry.teacher}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {entry.room}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {entry.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {entry.room.includes('Zoom') ? (
                    <button
                      onClick={onOpenZoomModal}
                      className="px-4 py-2 rounded-full bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" /> Join Zoom
                    </button>
                  ) : (
                    <span className="px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold">
                      Physical Lab
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center clay-card bg-purple-50/50">
              <CalendarIcon className="w-12 h-12 text-purple-300 mx-auto mb-2" />
              <p className="text-purple-900 font-bold text-sm">No scheduled practical classes for {selectedDay}.</p>
              <p className="text-xs text-purple-500 mt-1">Use this day for lab report revision & virtual simulator practice!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

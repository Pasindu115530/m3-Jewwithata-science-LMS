'use client';

import React, { useState } from 'react';
import { Video, Mic, MicOff, VideoOff, MessageSquare, Hand, Download, X, Users, Sparkles, Send, CheckCircle } from 'lucide-react';
import { mockZoomClasses } from '../../data/mockData';

interface ZoomClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZoomClassModal: React.FC<ZoomClassModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const currentClass = mockZoomClasses[0];
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'worksheet' | 'attendees'>('chat');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Prof. Sarah', text: 'Welcome everyone! Please open Titration Simulation #1.', time: '10:30 AM', isTeacher: true },
    { sender: 'Alex Vance', text: 'Dr. Sarah, what is the indicator starting concentration?', time: '10:32 AM', isTeacher: false },
    { sender: 'Mia Sharma', text: 'I completed the initial titration trial. Pink endpoint reached at 24.2 mL!', time: '10:33 AM', isTeacher: false }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [downloadedWorksheet, setDownloadedWorksheet] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'Mia Sharma (You)', text: newMessage.trim(), time: 'Just now', isTeacher: false }
    ]);
    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-[32px] overflow-hidden border border-purple-500/30 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                {currentClass.title}
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
                  LIVE ZOOM PRACTICAL
                </span>
              </h3>
              <p className="text-slate-400 text-xs">Instructor: {currentClass.teacherName} • {currentClass.attendeesCount} Students Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden">
          {/* Main Video Screen */}
          <div className="lg:col-span-2 bg-slate-950 p-4 flex flex-col justify-between relative overflow-hidden">
            {/* Live Camera Stream Container */}
            <div className="relative w-full h-full min-h-[300px] sm:min-h-[400px] rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 flex items-center justify-center">
              {isVideoOn ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1200"
                    alt="Teacher Live Science Lab Stream"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80"
                  />
                  {/* Overlay Teacher PIP */}
                  <div className="absolute top-4 left-4 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700">
                    <img
                      src={currentClass.teacherAvatar}
                      alt={currentClass.teacherName}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-white text-xs font-bold">{currentClass.teacherName} (Host)</span>
                  </div>

                  {/* On-screen Lab Status Indicator */}
                  <div className="absolute bottom-4 left-4 px-3.5 py-2 rounded-2xl bg-purple-900/80 backdrop-blur-md border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-300 animate-spin" />
                    <span>Live Experiment: NaOH + HCl Titration Step 3</span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <VideoOff className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Your camera is turned off</p>
                </div>
              )}

              {/* Student Self PIP Window */}
              <div className="absolute bottom-4 right-4 w-28 h-20 sm:w-36 sm:h-24 rounded-xl overflow-hidden border-2 border-purple-500/60 shadow-lg bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
                  alt="Student Camera"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white bg-slate-900/80 px-1.5 py-0.5 rounded">
                  You (Mia)
                </div>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition flex items-center justify-center ${
                  isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full transition flex items-center justify-center ${
                  !isVideoOn ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
                title={isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`px-4 py-2.5 rounded-full transition text-xs font-bold flex items-center gap-2 ${
                  handRaised ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <Hand className="w-4 h-4" />
                <span>{handRaised ? 'Hand Raised' : 'Raise Hand'}</span>
              </button>

              <button
                onClick={() => {
                  setDownloadedWorksheet(true);
                  setTimeout(() => setDownloadedWorksheet(false), 3000);
                }}
                className="px-4 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 transition"
              >
                {downloadedWorksheet ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Download className="w-4 h-4" />}
                <span>{downloadedWorksheet ? 'Downloaded!' : 'Lab Sheet PDF'}</span>
              </button>
            </div>
          </div>

          {/* Right Tabbed Panel (Chat, Worksheet, Attendees) */}
          <div className="bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-full overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'chat'
                    ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Live Chat</span>
              </button>

              <button
                onClick={() => setActiveTab('worksheet')}
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'worksheet'
                    ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Worksheet</span>
              </button>

              <button
                onClick={() => setActiveTab('attendees')}
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'attendees'
                    ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Students (42)</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-4 overflow-y-auto">
              {activeTab === 'chat' && (
                <div className="flex flex-col h-full justify-between gap-3">
                  <div className="space-y-3 overflow-y-auto max-h-[280px]">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`p-2.5 rounded-2xl text-xs ${
                        msg.isTeacher ? 'bg-purple-900/40 border border-purple-500/30' : 'bg-slate-800/80 border border-slate-700/60'
                      }`}>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`font-bold ${msg.isTeacher ? 'text-purple-300' : 'text-slate-200'}`}>
                            {msg.sender}
                          </span>
                          <span className="text-[10px] text-slate-500">{msg.time}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <input
                      type="text"
                      placeholder="Type your question..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white transition"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'worksheet' && (
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3.5 rounded-2xl bg-purple-900/30 border border-purple-500/30">
                    <h4 className="font-bold text-purple-300 mb-1">Live Experiment Protocol</h4>
                    <p className="text-slate-300 leading-relaxed">
                      1. Fill burette with 0.1 M NaOH solution.<br/>
                      2. Add 25 mL unknown HCl into conical flask.<br/>
                      3. Add 3 drops of Phenolphthalein.<br/>
                      4. Record initial and endpoint volumes.
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700">
                    <h5 className="font-bold text-slate-200 mb-1">Formula Reminder</h5>
                    <p className="font-mono text-purple-300 text-[11px]">M1 × V1 = M2 × V2</p>
                  </div>
                </div>
              )}

              {activeTab === 'attendees' && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-purple-950/60 text-purple-200 border border-purple-800">
                    <span className="font-bold">Prof. Sarah Jenkins (Host)</span>
                    <span className="px-2 py-0.5 rounded bg-purple-800 text-[10px]">Host</span>
                  </div>
                  {['Mia Sharma (You)', 'Alex Vance', 'Ethan Miller', 'Sophia Zhang', 'Noah Patel'].map((name, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 text-slate-300">
                      <span>{name}</span>
                      <Mic className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

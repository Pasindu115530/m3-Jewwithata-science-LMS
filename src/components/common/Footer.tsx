import React from 'react';
import Link from 'next/link';
import { FlaskConical, Shield, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-purple-900 to-slate-950 text-purple-100 pt-16 pb-8 px-6 sm:px-12 mt-16 rounded-t-[40px] shadow-2xl relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-purple-800/60">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
              <FlaskConical className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Science Practical LMS
            </span>
          </div>
          <p className="text-xs text-purple-200/80 leading-relaxed">
            The next-generation interactive learning management platform designed for hands-on chemistry, physics, and biology practical education with live Zoom classes and virtual lab simulators.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2.5 text-xs text-purple-200/80">
            <li><Link href="/courses/" className="hover:text-purple-300 transition">Interactive Courses</Link></li>
            <li><Link href="/courses/#simulators" className="hover:text-purple-300 transition">Virtual Lab Simulators</Link></li>
            <li><Link href="/student/dashboard/" className="hover:text-purple-300 transition">Zoom Live Practical Schedule</Link></li>
            <li><Link href="/student/dashboard/" className="hover:text-purple-300 transition">Weekly Timetable</Link></li>
          </ul>
        </div>

        {/* Subjects */}
        <div>
          <h4 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">Practicals</h4>
          <ul className="space-y-2.5 text-xs text-purple-200/80">
            <li><Link href="/courses/#chemistry" className="hover:text-purple-300 transition">Organic & Analytical Chemistry</Link></li>
            <li><Link href="/courses/#physics" className="hover:text-purple-300 transition">Wave Optics & Mechanics</Link></li>
            <li><Link href="/courses/#biology" className="hover:text-purple-300 transition">Microbiology & Plant DNA Isolation</Link></li>
            <li><Link href="/gallery/" className="hover:text-purple-300 transition">Student Practical Gallery</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 text-xs text-purple-200/80">
          <h4 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">Contact & Support</h4>
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>Science Practical Innovation Hub, Suite 402</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>support@sciencepractical.edu</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>+1 (800) 555-LABS (5227)</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-300/70">
        <p>© 2026 Science Practical LMS. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-400" /> SSL Secured Platform</span>
          <span>Terms of Service</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
};

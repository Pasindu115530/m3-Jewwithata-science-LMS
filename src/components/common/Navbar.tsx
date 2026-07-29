'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FlaskConical, Menu, X, Sparkles, UserCheck, GraduationCap } from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  userRole?: UserRole;
  activeSection?: string;
  onSelectRole?: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userRole = 'public',
  activeSection = 'home',
  onSelectRole,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'courses', label: 'Courses', href: '/courses/' },
    { id: 'gallery', label: 'Gallery', href: '/gallery/' },
    { id: 'about', label: 'About', href: '/#about' },
    { id: 'contact', label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3 bg-white/80 backdrop-blur-xl border-b border-purple-100/60 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo Link */}
        <Link
          href="/"
          className="flex items-center gap-3 cursor-pointer group"
          aria-label="Science Practical LMS Home"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition transform">
            <FlaskConical className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-purple-950 via-purple-800 to-indigo-900 bg-clip-text text-transparent">
              Science Practical
            </span>
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-purple-600">
              LMS Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-purple-50/80 rounded-full border border-purple-100/80 shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                activeSection === link.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-900 hover:text-purple-600 hover:bg-purple-100/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Authentication & Dashboard Quick Switch Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/student/dashboard/"
            onClick={() => onSelectRole && onSelectRole('student')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-purple-700 bg-purple-100/80 hover:bg-purple-200/80 transition"
          >
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>Student Portal</span>
          </Link>

          <Link
            href="/teacher/dashboard/"
            onClick={() => onSelectRole && onSelectRole('teacher')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-indigo-700 bg-indigo-100/80 hover:bg-indigo-200/80 transition"
          >
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Teacher Portal</span>
          </Link>

          <Link
            href="/login/"
            className="clay-btn px-5 py-2.5 text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Login / Join</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-2xl bg-purple-50 text-purple-900 hover:bg-purple-100"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-4 bg-white/95 rounded-3xl border border-purple-100 shadow-xl space-y-2 animate-in fade-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold text-purple-900 hover:bg-purple-50 capitalize"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-purple-100 flex flex-col gap-2">
            <Link
              href="/student/dashboard/"
              onClick={() => {
                if (onSelectRole) onSelectRole('student');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-2xl bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" /> Student Portal
            </Link>
            <Link
              href="/teacher/dashboard/"
              onClick={() => {
                if (onSelectRole) onSelectRole('teacher');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-2xl bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" /> Teacher Portal
            </Link>
            <Link
              href="/login/"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-2xl bg-purple-600 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Login / Join
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

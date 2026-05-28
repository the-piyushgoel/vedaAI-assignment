'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function EmptyState() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-xl mx-auto my-12">
      {/* Visual illustration containing document & red magnifier */}
      <div className="relative mb-8 w-48 h-48 flex items-center justify-center bg-gray-50 rounded-full border border-gray-100">
        <svg 
          width="160" 
          height="160" 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background curved line */}
          <path 
            d="M50 140 C 30 110, 40 60, 90 60 C 130 60, 160 90, 150 140" 
            stroke="#94a3b8" 
            strokeWidth="2" 
            strokeDasharray="4 4" 
            fill="none" 
          />
          {/* Sparkles */}
          <path d="M45 75 L47 80 L52 81 L47 82 L45 87 L43 82 L38 81 L43 80 Z" fill="#38bdf8" />
          <path d="M155 125 L157 130 L162 131 L157 132 L155 137 L153 132 L148 131 L153 130 Z" fill="#38bdf8" />

          {/* Document Sheet */}
          <rect x="70" y="50" width="60" height="80" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="82" y1="70" x2="118" y2="70" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          <line x1="82" y1="85" x2="118" y2="85" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          <line x1="82" y1="100" x2="105" y2="100" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

          {/* Small badge card */}
          <rect x="110" y="38" width="28" height="18" rx="4" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
          <circle cx="118" cy="47" r="2.5" fill="#94a3b8" />
          <circle cx="128" cy="47" r="2.5" fill="#94a3b8" />

          {/* Magnifying Glass with Red X */}
          <circle cx="95" cy="105" r="30" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
          {/* Red X Badge */}
          <circle cx="95" cy="105" r="16" fill="#ef4444" />
          <path d="M89 99 L101 111 M101 99 L89 111" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          {/* Handle */}
          <path d="M116 126 C117.5 127.5, 126 136, 128.5 138.5" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      {/* Headings and Actions */}
      <h3 className="text-xl font-bold font-display text-gray-900 mb-2">
        No assignments yet
      </h3>
      <p className="text-sm text-gray-500 mb-8 leading-relaxed">
        Create your first assignment to start collecting and grading student submissions. 
        You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>
      
      <button
        onClick={() => router.push('/create')}
        className="flex items-center gap-2 bg-[#111827] text-white hover:bg-gray-800 transition-colors py-3.5 px-6 rounded-full font-semibold text-sm shadow-md active:scale-95"
      >
        <Plus className="w-5 h-5" />
        <span>Create Your First Assignment</span>
      </button>
    </div>
  );
}

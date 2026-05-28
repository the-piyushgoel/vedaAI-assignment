'use client';

import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onSearchChange?: (val: string) => void;
  searchValue?: string;
}

export default function DashboardHeader({
  title,
  subtitle,
  onSearchChange,
  searchValue = ''
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-8 py-6 bg-white border-b border-gray-100 gap-4 sticky top-0 z-20">
      {/* Title block */}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold font-display text-gray-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* Actions: Search + Profile (Desktop) */}
      <div className="flex items-center gap-4 ml-auto sm:ml-0">
        {/* Search Input */}
        {onSearchChange && (
          <div className="relative w-full max-w-xs sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Assignment..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-gray-900"
            />
          </div>
        )}

        {/* Notifications and Profile */}
        <div className="hidden md:flex items-center gap-4">
          {/* Notification Bell */}
          <button className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-50 relative transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
          </button>

          {/* User profile dropdown button */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-gray-100 cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border border-orange-200 shadow-xs">
              <span className="text-orange-600 font-bold text-sm">JD</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">John Doe</span>
              <span className="text-[10px] text-gray-400">Teacher</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}

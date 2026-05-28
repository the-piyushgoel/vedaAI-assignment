'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Users, 
  FileText, 
  Wand2, 
  Library, 
  Settings, 
  Plus 
} from 'lucide-react';
import { useAssignmentStore } from '@/store/assignmentStore';

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export default function Sidebar({ className = '', onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const assignments = useAssignmentStore((state) => state.assignments);
  
  // Calculate count of assignments
  const assignmentCount = assignments.length;

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'My Groups', href: '#', icon: Users },
    { name: 'Assignments', href: '/assignments', icon: FileText, badge: assignmentCount > 0 ? assignmentCount : undefined },
    { name: 'AI Teacher\'s Toolkit', href: '#', icon: Wand2 },
    { name: 'My Library', href: '#', icon: Library },
  ];

  const isActive = (href: string) => {
    if (href === '#') return false;
    return pathname.startsWith(href);
  };

  const handleCreateClick = () => {
    router.push('/create');
    if (onClose) onClose();
  };

  return (
    <aside className={`flex flex-col h-full bg-white border-r border-gray-100 p-6 justify-between w-64 ${className}`}>
      <div className="flex flex-col gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-linear-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-xs">
            V
          </div>
          <span className="text-xl font-bold tracking-tight font-display text-gray-900">VedaAI</span>
        </div>

        {/* Create Assignment CTA */}
        <button 
          onClick={handleCreateClick}
          className="flex items-center justify-center gap-2 w-full bg-[#111827] text-white hover:bg-gray-800 transition-colors py-3.5 px-4 rounded-full font-medium text-sm shadow-xs active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Create Assignment</span>
        </button>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between py-3 px-4 rounded-2xl transition-all duration-200 group text-sm ${
                  active 
                    ? 'bg-gray-50 text-gray-900 font-semibold shadow-xs' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-colors ${active ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold min-w-5 text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        {/* Settings */}
        <Link
          href="#"
          className={`flex items-center gap-3 py-3 px-4 rounded-2xl transition-all duration-200 text-sm ${
            isActive('#') 
              ? 'bg-gray-50 text-gray-900 font-semibold shadow-xs' 
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
          }`}
        >
          <Settings className="w-5 h-5 text-gray-400" />
          <span>Settings</span>
        </Link>

        {/* School Profile Card */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center overflow-hidden border border-orange-200">
            <span className="text-orange-600 font-bold text-sm">DP</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-gray-900 truncate">Delhi Public School</span>
            <span className="text-[10px] text-gray-400 truncate">Bokaro Steel City</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

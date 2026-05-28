'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { getSocket } from '@/services/socket';
import { useAssignmentStore } from '@/store/assignmentStore';
import { Menu, X, Bell, Home as HomeIcon, FileText, Library, Wand2, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  const { fetchAssignments, updateAssignmentProgress, setAssignmentStatus } = useAssignmentStore();

  useEffect(() => {
    fetchAssignments();

    const socket = getSocket();

    socket.on('connect', () => {
      console.log('WebSocket client connected to server');
    });

    socket.on('generation-progress', (data: { assignmentId: string; progress: number; progressMessage: string }) => {
      console.log('Realtime progress update:', data);
      updateAssignmentProgress(data.assignmentId, data.progress, data.progressMessage);
    });

    socket.on('generation-completed', (data: { assignmentId: string; assignment: any }) => {
      console.log('Realtime generation completed:', data);
      setAssignmentStatus(data.assignmentId, 'completed', data.assignment.result);
      fetchAssignments();
    });

    socket.on('generation-failed', (data: { assignmentId: string; error: string }) => {
      console.log('Realtime generation failed:', data);
      setAssignmentStatus(data.assignmentId, 'failed');
    });

    return () => {
      socket.off('connect');
      socket.off('generation-progress');
      socket.off('generation-completed');
      socket.off('generation-failed');
    };
  }, [fetchAssignments, updateAssignmentProgress, setAssignmentStatus]);

  const mobileNavItems = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon },
    { name: 'Assignments', href: '/assignments', icon: FileText },
    { name: 'Library', href: '#', icon: Library },
    { name: 'AI Toolkit', href: '#', icon: Wand2 }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7fb]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer (Overlay and Menu) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Sidebar container */}
          <div className="relative flex flex-col w-64 bg-white h-full shadow-xl">
            <button 
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto">
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-linear-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              V
            </div>
            <span className="text-lg font-bold tracking-tight font-display text-gray-900">VedaAI</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-50 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-orange-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border border-orange-200">
              <span className="text-orange-600 font-bold text-xs">DP</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 pb-24 md:pb-8">
          {children}
        </main>

        {/* Floating Action Button (Mobile Only) */}
        <button
          onClick={() => router.push('/create')}
          className="fixed bottom-20 right-6 z-40 md:hidden w-14 h-14 bg-[#111827] text-white hover:bg-gray-800 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-100 py-3 px-6 flex justify-around items-center shadow-lg">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = item.href !== '#' && pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  active ? 'text-gray-900 font-semibold' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

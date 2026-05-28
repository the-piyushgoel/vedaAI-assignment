'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, Eye, Trash2, Calendar, FileClock, AlertCircle } from 'lucide-react';
import { IAssignment } from '@/types/assignment';
import { useAssignmentStore } from '@/store/assignmentStore';
import { formatDate } from '@/lib/utils';

interface AssignmentCardProps {
  assignment: IAssignment;
}

export default function AssignmentCard({ assignment }: AssignmentCardProps) {
  const router = useRouter();
  const deleteAssignment = useAssignmentStore((state) => state.deleteAssignment);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCardClick = () => {
    if (assignment.status === 'completed') {
      router.push(`/paper/${assignment._id}`);
    } else {
      router.push(`/paper/generate?id=${assignment._id}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${assignment.subject}"?`)) {
      await deleteAssignment(assignment._id);
    }
    setMenuOpen(false);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleCardClick();
    setMenuOpen(false);
  };

  const getStatusBadge = () => {
    switch (assignment.status) {
      case 'completed':
        return (
          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
            Completed
          </span>
        );
      case 'processing':
        return (
          <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100 animate-pulse">
            Processing ({assignment.progress}%)
          </span>
        );
      case 'failed':
        return (
          <span className="text-[10px] font-semibold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-100">
            Failed
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-semibold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-100">
            Pending
          </span>
        );
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[160px] relative group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {getStatusBadge()}
          </div>
          <h4 className="text-base font-bold font-display text-gray-900 truncate leading-snug group-hover:text-black">
            {assignment.subject}
          </h4>
        </div>

        {/* Dropdown Menu Container */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MoreVertical className="w-4.5 h-4.5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
              <button 
                onClick={handleView}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Eye className="w-4 h-4 text-gray-400" />
                <span>View Paper</span>
              </button>
              <button 
                onClick={handleDelete}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50/50 transition-colors border-t border-gray-50"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress display if processing */}
      {assignment.status === 'processing' && (
        <div className="my-3 flex flex-col gap-1">
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${assignment.progress}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 truncate">{assignment.progressMessage}</span>
        </div>
      )}

      {/* Error message if failed */}
      {assignment.status === 'failed' && (
        <div className="my-2 p-2 bg-rose-50/50 border border-rose-100 rounded-lg flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
          <span className="text-[10px] text-rose-600 line-clamp-1">{assignment.progressMessage || 'Failed to generate questions'}</span>
        </div>
      )}

      {/* Bottom Dates row */}
      <div className={`flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-50 pt-4 ${assignment.status === 'processing' || assignment.status === 'failed' ? 'mt-2' : 'mt-6'}`}>
        <div className="flex items-center gap-1">
          <FileClock className="w-3.5 h-3.5 text-gray-300" />
          <span>Created: {formatDate(assignment.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1 font-medium text-gray-600">
          <Calendar className="w-3.5 h-3.5 text-gray-300" />
          <span>Due: {formatDate(assignment.dueDate)}</span>
        </div>
      </div>
    </div>
  );
}

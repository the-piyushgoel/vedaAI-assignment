'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AssignmentCard from '@/components/cards/AssignmentCard';
import EmptyState from '@/components/dashboard/EmptyState';
import { useAssignmentStore } from '@/store/assignmentStore';
import { Plus, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AssignmentsPage() {
  const router = useRouter();
  const { assignments, loading } = useAssignmentStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'processing' | 'failed'>('all');

  // Filter assignments by search query and status filter
  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch = a.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <DashboardHeader 
        title="Assignments" 
        subtitle="Manage and edit your configured assessments" 
        searchValue={search} 
        onSearchChange={setSearch} 
      />

      <div className="p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full relative min-h-[calc(100vh-100px)]">
        {/* Toolbar: Filter + Quick Actions */}
        {assignments.length > 0 && (
          <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase">Filter By:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['all', 'completed', 'processing', 'failed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium capitalize transition-all ${
                      statusFilter === filter
                        ? 'bg-[#111827] text-white shadow-xs'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => router.push('/create')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-900 px-3.5 py-2 rounded-xl transition-all border border-gray-150"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Grid</span>
            </button>
          </div>
        )}

        {/* List content */}
        {loading && assignments.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white border border-gray-100 rounded-2xl p-6 min-h-[160px] flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <div className="w-16 h-4 rounded-sm shimmer" />
                  <div className="w-3/4 h-5 rounded-sm shimmer" />
                </div>
                <div className="w-full h-1.5 rounded-sm shimmer my-2" />
                <div className="flex justify-between mt-4">
                  <div className="w-20 h-3 rounded-sm shimmer" />
                  <div className="w-20 h-3 rounded-sm shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAssignments.length === 0 ? (
          search || statusFilter !== 'all' ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-sm text-gray-500 my-8">
              No assignments found matching the active search or filters.
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard key={assignment._id} assignment={assignment} />
            ))}
          </div>
        )}

        {/* Floating Capsule Button at the bottom (Figma Inspired) */}
        {assignments.length > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 hidden md:block">
            <button
              onClick={() => router.push('/create')}
              className="flex items-center gap-2 bg-[#111827] text-white hover:bg-gray-800 transition-colors py-3.5 px-6 rounded-full font-semibold text-sm shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assignment</span>
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

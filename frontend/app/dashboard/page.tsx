'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/cards/StatsCard';
import AssignmentCard from '@/components/cards/AssignmentCard';
import EmptyState from '@/components/dashboard/EmptyState';
import { useAssignmentStore } from '@/store/assignmentStore';
import { FileText, ClipboardCheck, Play, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { assignments, loading } = useAssignmentStore();
  const [search, setSearch] = useState('');

  const filteredAssignments = assignments.filter((a) =>
    a.subject.toLowerCase().includes(search.toLowerCase())
  );

  const total = assignments.length;
  const completed = assignments.filter((a) => a.status === 'completed').length;
  const processing = assignments.filter((a) => a.status === 'processing').length;
  const questionsCount = assignments.reduce((acc, curr) => {
    if (curr.status === 'completed' && curr.result?.sections) {
      return acc + curr.result.sections.reduce((sAcc, s) => sAcc + s.questions.length, 0);
    }
    return acc;
  }, 0);

  return (
    <Layout>
      <DashboardHeader 
        title="Dashboard" 
        subtitle="Manage and create assessments for your classes" 
        searchValue={search} 
        onSearchChange={setSearch} 
      />

      <div className="p-8 flex flex-col gap-8 max-w-7xl mx-auto w-full">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Assessments"
            value={total}
            icon={FileText}
            iconColorClass="text-blue-600"
            iconBgClass="bg-blue-50"
            description="Papers configured"
          />
          <StatsCard
            title="Active Generation"
            value={processing}
            icon={Play}
            iconColorClass="text-amber-600"
            iconBgClass="bg-amber-50"
            description="Processing in background"
          />
          <StatsCard
            title="Ready Papers"
            value={completed}
            icon={ClipboardCheck}
            iconColorClass="text-emerald-600"
            iconBgClass="bg-emerald-50"
            description="Ready to export"
          />
          <StatsCard
            title="AI Generated Questions"
            value={questionsCount}
            icon={Sparkles}
            iconColorClass="text-purple-600"
            iconBgClass="bg-purple-50"
            description="Stored in catalog"
          />
        </div>

        {/* Recent Assignments section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-gray-900">Recent Assignments</h2>
            {total > 0 && (
              <Link 
                href="/assignments" 
                className="text-xs font-semibold text-gray-600 hover:text-black transition-colors"
              >
                View all
              </Link>
            )}
          </div>

          {loading && assignments.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
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
            search ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-sm text-gray-500">
                No assignments match your search &quot;{search}&quot;.
              </div>
            ) : (
              <EmptyState />
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssignments.slice(0, 6).map((assignment) => (
                <AssignmentCard key={assignment._id} assignment={assignment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

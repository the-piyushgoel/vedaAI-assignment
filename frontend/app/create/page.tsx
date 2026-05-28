'use client';

import React from 'react';
import Layout from '@/components/layout/Layout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AssignmentForm from '@/components/forms/AssignmentForm';

export default function CreatePage() {
  return (
    <Layout>
      <DashboardHeader 
        title="Create Assignment" 
        subtitle="Set up a new assignment for your students" 
      />
      <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
        <AssignmentForm />
      </div>
    </Layout>
  );
}

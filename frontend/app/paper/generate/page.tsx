'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useAssignmentStore } from '@/store/assignmentStore';
import { getSocket } from '@/services/socket';
import { Loader2, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

function GenerationStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('id');

  const { 
    currentAssignment, 
    fetchAssignmentById, 
    updateAssignmentProgress, 
    setAssignmentStatus 
  } = useAssignmentStore();

  const [localProgress, setLocalProgress] = useState(0);
  const [localMessage, setLocalMessage] = useState('Queued');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!assignmentId) return;

    // Load initial status
    fetchAssignmentById(assignmentId).then((assignment) => {
      if (assignment) {
        setLocalProgress(assignment.progress);
        setLocalMessage(assignment.progressMessage);
        if (assignment.status === 'completed') {
          router.push(`/paper/${assignment._id}`);
        } else if (assignment.status === 'failed') {
          setErrorMsg(assignment.progressMessage || 'Failed to generate assessment');
        }
      }
    });

    const socket = getSocket();

    // Join room
    socket.emit('join-assignment', assignmentId);

    // Register listeners
    socket.on('generation-progress', (data: { assignmentId: string; progress: number; progressMessage: string }) => {
      if (data.assignmentId === assignmentId) {
        setLocalProgress(data.progress);
        setLocalMessage(data.progressMessage);
        updateAssignmentProgress(data.assignmentId, data.progress, data.progressMessage);
      }
    });

    socket.on('generation-completed', (data: { assignmentId: string; assignment: any }) => {
      if (data.assignmentId === assignmentId) {
        setLocalProgress(100);
        setLocalMessage('Completed');
        setAssignmentStatus(data.assignmentId, 'completed', data.assignment.result);
        
        // Auto redirect after a short delay so the user feels the completion
        setTimeout(() => {
          router.push(`/paper/${assignmentId}`);
        }, 1200);
      }
    });

    socket.on('generation-failed', (data: { assignmentId: string; error: string }) => {
      if (data.assignmentId === assignmentId) {
        setAssignmentStatus(data.assignmentId, 'failed');
        setErrorMsg(data.error);
      }
    });

    return () => {
      socket.emit('leave-assignment', assignmentId);
      socket.off('generation-progress');
      socket.off('generation-completed');
      socket.off('generation-failed');
    };
  }, [assignmentId, fetchAssignmentById, updateAssignmentProgress, setAssignmentStatus, router]);

  if (!assignmentId) {
    return (
      <div className="p-8 text-center text-gray-500">
        Missing Assignment ID.
      </div>
    );
  }

  // Generation steps matching percentages
  const steps = [
    { name: 'Uploading & parsing criteria', minProgress: 10 },
    { name: 'Generating AI questions via OpenAI', minProgress: 30 },
    { name: 'Structuring paper sections & difficulty', minProgress: 50 },
    { name: 'Finalizing exam paper structure', minProgress: 80 },
    { name: 'Building printable layout', minProgress: 95 }
  ];

  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      {/* Outer Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-xs flex flex-col gap-8">
        
        {/* Header summary */}
        <div className="flex flex-col text-center items-center gap-2">
          {errorMsg ? (
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 border border-rose-100 mb-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
          ) : (
            <div className="relative w-16 h-16 flex items-center justify-center mb-2">
              {/* Spinning progress outer rim */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#f3f4f6"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#111827"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - localProgress / 100)}`}
                  className="transition-all duration-300"
                />
              </svg>
              {/* Inner number */}
              <span className="absolute text-sm font-bold text-gray-800">{localProgress}%</span>
            </div>
          )}

          <h3 className="text-xl font-bold font-display text-gray-900 leading-snug">
            {errorMsg ? 'Assessment Generation Failed' : `Generating Assessment Paper`}
          </h3>
          <p className="text-sm text-gray-400 max-w-sm">
            {errorMsg 
              ? 'An error occurred during OpenAI call execution.' 
              : `Creating paper for "${currentAssignment?.subject || 'Assessment'}"`}
          </p>
        </div>

        {/* Pipeline Steps Tracker */}
        {!errorMsg && (
          <div className="flex flex-col gap-4 border-y border-gray-50 py-6">
            {steps.map((step, idx) => {
              const completed = localProgress >= step.minProgress;
              const active = localProgress >= (idx === 0 ? 0 : steps[idx - 1].minProgress) && localProgress < step.minProgress;
              
              return (
                <div 
                  key={step.name} 
                  className={`flex items-center gap-3.5 transition-colors duration-300 ${
                    completed ? 'text-gray-900' : active ? 'text-blue-600' : 'text-gray-300'
                  }`}
                >
                  {completed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : active ? (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600 shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-300">
                      {idx + 1}
                    </div>
                  )}
                  <span className={`text-sm ${completed ? 'font-medium' : active ? 'font-semibold' : 'font-normal'}`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Error Box and retry CTA */}
        {errorMsg && (
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-rose-700">Error Details</span>
                <p className="text-xs text-rose-600 leading-relaxed font-mono">{errorMsg}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setErrorMsg(null);
                setLocalProgress(0);
                setLocalMessage('Queued');
                router.refresh();
              }}
              className="flex items-center justify-center gap-2 bg-[#111827] text-white hover:bg-gray-800 transition-colors py-3.5 px-4 rounded-full font-medium text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Generation</span>
            </button>
          </div>
        )}

        {/* Bottom indicator message */}
        {!errorMsg && (
          <div className="text-center text-[11px] text-gray-400">
            <span>Status: </span>
            <span className="font-semibold text-gray-600">{localMessage}</span>
          </div>
        )}

      </div>
    </div>
  );
}

export default function GenerationStatusPage() {
  return (
    <Layout>
      <DashboardHeader 
        title="AI Generator" 
        subtitle="Live tracking paper synthesis progress" 
      />
      <Suspense fallback={
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      }>
        <GenerationStatusContent />
      </Suspense>
    </Layout>
  );
}

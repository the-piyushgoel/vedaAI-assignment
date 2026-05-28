'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ExamPaperView from '@/components/paper/ExamPaperView';
import PDFDownload from '@/components/paper/PDFDownload';
import { useAssignmentStore } from '@/store/assignmentStore';
import { Loader2, ArrowLeft, Info } from 'lucide-react';

export default function PaperDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchAssignmentById, currentAssignment, loading } = useAssignmentStore();

  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      fetchAssignmentById(id);
    }
  }, [id, fetchAssignmentById]);

  if (loading && !currentAssignment) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
          <span className="text-sm text-gray-400 mt-4">Loading assessment paper details...</span>
        </div>
      </Layout>
    );
  }

  if (!currentAssignment || !currentAssignment.result) {
    return (
      <Layout>
        <div className="p-8 text-center text-gray-500 max-w-md mx-auto my-12 flex flex-col gap-4">
          <p>We could not find the generated paper output. It may still be generating or might have failed.</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="btn-primary self-center"
          >
            Go back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  const paper = currentAssignment.result;

  return (
    <Layout>
      {/* Header with back navigation */}
      <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/assignments')}
            className="p-2 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold font-display text-gray-900 leading-snug">Assessment Paper</h1>
            <p className="text-[10px] text-gray-400">View and print your generated paper</p>
          </div>
        </div>
      </header>

      <div className="p-8 flex flex-col gap-6 max-w-4xl mx-auto w-full">
        {/* Dark Tip Card (Figma Inspired) */}
        <div className="bg-[#111827] text-white rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
          <div className="flex gap-3 items-start md:items-center min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs leading-relaxed text-gray-300">
              Certainly, John! Here is the customized Question Paper for your CBSE classes based on the NCERT chapters for <span className="font-semibold text-white">{currentAssignment.subject}</span>.
            </p>
          </div>
          
          <div className="shrink-0 no-print">
            <PDFDownload paper={paper} fileName={`VedaAI_${currentAssignment.subject.replace(/\s+/g, '_')}_Paper.pdf`} />
          </div>
        </div>

        {/* Paper Sheet view */}
        <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-xs">
          <ExamPaperView paper={paper} />
        </div>
      </div>
    </Layout>
  );
}

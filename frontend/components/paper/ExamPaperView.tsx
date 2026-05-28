'use client';

import React from 'react';
import { IExamPaper } from '@/types/assignment';

interface ExamPaperViewProps {
  paper: IExamPaper;
}

export default function ExamPaperView({ paper }: ExamPaperViewProps) {
  const getDifficultyBadge = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case 'Easy':
        return (
          <span className="text-[10px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-100 mr-2 no-print">
            Easy
          </span>
        );
      case 'Medium':
        return (
          <span className="text-[10px] font-bold tracking-wide uppercase bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md border border-amber-100 mr-2 no-print">
            Medium
          </span>
        );
      case 'Hard':
        return (
          <span className="text-[10px] font-bold tracking-wide uppercase bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md border border-rose-100 mr-2 no-print">
            Hard
          </span>
        );
    }
  };

  return (
    <div className="paper-container print-page animate-in fade-in duration-300">
      {/* Exam Header */}
      <div className="text-center flex flex-col gap-1.5 pb-4 border-b border-dashed border-gray-400">
        <h2 className="text-xl font-bold tracking-wide font-serif text-gray-900 uppercase">
          {paper.schoolName || 'Delhi Public School, Bokaro'}
        </h2>
        <div className="flex justify-center items-center gap-6 text-sm font-serif font-semibold text-gray-700">
          <span>Subject: {paper.subject}</span>
          <span>•</span>
          <span>Class: 10th Standard</span>
        </div>
      </div>

      {/* Marks & Time Row */}
      <div className="flex justify-between items-center py-3 text-sm font-serif font-semibold border-b-2 border-gray-900 text-gray-800">
        <span>Time allowed: {paper.timeAllowed || '45 minutes'}</span>
        <span>Maximum Marks: {paper.maxMarks || 20}</span>
      </div>

      {/* General Instructions */}
      <div className="py-3 text-xs italic font-serif text-gray-700">
        All questions are compulsory unless stated otherwise.
      </div>

      {/* Blank Student Fill-in Box */}
      <div className="border border-gray-300 p-4 rounded-lg my-4 flex flex-col sm:flex-row justify-between gap-4 font-serif text-xs text-gray-700">
        <div className="flex-1 flex gap-2">
          <span>Student Name:</span>
          <div className="flex-1 border-b border-dotted border-gray-400 min-w-40" />
        </div>
        <div className="flex gap-2">
          <span>Roll Number:</span>
          <div className="w-24 border-b border-dotted border-gray-400" />
        </div>
        <div className="flex gap-2">
          <span>Section / Class:</span>
          <div className="w-24 border-b border-dotted border-gray-400" />
        </div>
      </div>

      {/* Question Sections */}
      <div className="flex flex-col gap-6 mt-6">
        {paper.sections.map((section, sIdx) => (
          <div key={section.title} className="flex flex-col gap-3 font-serif">
            {/* Section Divider Header */}
            <div className="text-center font-bold text-sm tracking-widest bg-gray-50 border border-gray-100 py-1.5 rounded-md text-gray-900 uppercase">
              {section.title}
            </div>
            
            {/* Section Instruction */}
            {section.instruction && (
              <p className="text-xs italic text-gray-500 mb-1 pl-1">
                {section.instruction}
              </p>
            )}

            {/* Questions List */}
            <ol className="flex flex-col gap-4.5 pl-1.5">
              {section.questions.map((q, qIdx) => (
                <li key={qIdx} className="text-sm text-gray-950 flex items-start leading-relaxed">
                  <span className="font-bold mr-2">{qIdx + 1}.</span>
                  <div className="flex-1">
                    <div className="flex items-start flex-wrap gap-1">
                      {getDifficultyBadge(q.difficulty)}
                      <p className="inline whitespace-pre-line leading-relaxed">{q.question}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-800 text-xs shrink-0 ml-4">
                    [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      {/* Answer Key Sheet (Always rendered at bottom, page-break-before in print) */}
      <div className="mt-16 pt-8 border-t-2 border-double border-gray-400 break-before-page font-serif">
        <h3 className="text-center font-bold text-base tracking-widest text-gray-900 uppercase mb-6">
          Answer Key (For Teacher Reference)
        </h3>

        <div className="flex flex-col gap-6">
          {paper.sections.map((section) => (
            <div key={section.title + '-key'} className="flex flex-col gap-4">
              <span className="font-bold text-xs uppercase text-gray-500 tracking-wider">
                {section.title} answers
              </span>

              <ol className="flex flex-col gap-4 pl-1">
                {section.questions.map((q, qIdx) => (
                  <li key={qIdx} className="text-sm text-gray-850 flex flex-col gap-1.5 leading-relaxed">
                    <div className="flex items-start">
                      <span className="font-bold mr-2">{qIdx + 1}.</span>
                      <p className="font-semibold text-gray-900">{q.question.split('\n')[0]} ...</p>
                    </div>
                    <div className="pl-5 text-gray-600 whitespace-pre-line bg-gray-50/50 p-3 rounded-lg border border-gray-100 text-xs">
                      <span className="font-bold text-gray-500 block mb-1">Answer:</span>
                      {q.answer || 'Provide response explanations.'}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

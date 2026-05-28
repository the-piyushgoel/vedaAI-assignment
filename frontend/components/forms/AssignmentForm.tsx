'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  UploadCloud, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  CheckCircle,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '@/store/assignmentStore';

const questionRowSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  count: z.number().int().min(1, 'Min 1 question'),
  marks: z.number().int().min(1, 'Min 1 mark')
});

const formSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  dueDate: z.string().min(1, 'Due date is required'),
  questionTypes: z.array(questionRowSchema).min(1, 'Add at least one question type'),
  additionalInstructions: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function AssignmentForm() {
  const router = useRouter();
  const createAssignment = useAssignmentStore((state) => state.createAssignment);

  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      dueDate: '',
      questionTypes: [
        { type: 'Multiple Choice Questions', count: 4, marks: 1 },
        { type: 'Short Questions', count: 3, marks: 2 }
      ],
      additionalInstructions: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questionTypes'
  });

  const questionTypes = watch('questionTypes') || [];
  const totalQuestions = questionTypes.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
  const totalMarks = questionTypes.reduce((sum, item) => sum + ((Number(item.count) || 0) * (Number(item.marks) || 0)), 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      });
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const assignment = await createAssignment({
        ...data,
        fileUrl: uploadedFile ? `mock-url-for-${uploadedFile.name}` : undefined
      });
      router.push(`/paper/generate?id=${assignment._id}`);
    } catch (error) {
      console.error('Failed to create assignment:', error);
      alert('Error creating assignment. Please try again.');
      setSubmitting(false);
    }
  };

  const questionTypeOptions = [
    'Multiple Choice Questions',
    'Short Questions',
    'Long Questions',
    'Diagram/Graph-Based Questions',
    'Numerical Problems'
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-xs flex flex-col gap-6">
        
        <h2 className="text-xl font-bold font-display text-gray-900 border-b border-gray-100 pb-4">
          Assignment Details
          <span className="block text-xs font-normal text-gray-400 mt-1">Basic information about your assignment</span>
        </h2>

        {/* Drag & Drop File Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Reference Material (Optional)</label>
          
          {!uploadedFile ? (
            <div className="border border-dashed border-gray-200 hover:border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-gray-50/50 group relative">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-gray-600 transition-colors" />
              <span className="text-sm font-medium text-gray-700">Choose a file or drag & drop it here</span>
              <span className="text-xs text-gray-400">JPEG, PNG, PDF up to 10MB</span>
              <button 
                type="button" 
                className="mt-3 btn-secondary py-1.5 px-4 text-xs font-semibold"
              >
                Browse Files
              </button>
            </div>
          ) : (
            <div className="border border-emerald-100 bg-emerald-50/30 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 truncate max-w-md">{uploadedFile.name}</span>
                  <span className="text-xs text-gray-400">{uploadedFile.size}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <span className="text-[10px] text-gray-400">Upload images/documents of your preferred curriculum, textbook chapter, or reference</span>
        </div>

        {/* Grid for Subject and Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subject Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Subject / Topic</label>
            <input
              type="text"
              placeholder="e.g. Electricity, Photosynthesis, DBMS"
              {...register('subject')}
              className={`w-full px-4 py-3 text-sm bg-gray-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-gray-900 ${
                errors.subject ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
              }`}
            />
            {errors.subject && (
              <span className="text-xs text-red-500 font-medium">{errors.subject.message}</span>
            )}
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Due Date</label>
            <div className="relative">
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                {...register('dueDate')}
                className={`w-full px-4 py-3 text-sm bg-gray-50 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-gray-900 ${
                  errors.dueDate ? 'border-red-300 focus:ring-red-200' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.dueDate && (
              <span className="text-xs text-red-500 font-medium">{errors.dueDate.message}</span>
            )}
          </div>
        </div>

        {/* Dynamic Question Grid */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-gray-700">Question Layout Grid</label>
          
          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <div 
                key={field.id} 
                className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100 relative group animate-in fade-in slide-in-from-top-1 duration-150"
              >
                {/* Question Type Selector */}
                <div className="w-full sm:flex-1">
                  <select
                    {...register(`questionTypes.${index}.type` as const)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-gray-200"
                  >
                    {questionTypeOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Number of questions stepper */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-16 text-right">Questions:</span>
                  <div className="flex items-center border border-gray-250 bg-white rounded-lg overflow-hidden h-9">
                    <button
                      type="button"
                      onClick={() => {
                        const val = Number(watch(`questionTypes.${index}.count`)) || 0;
                        if (val > 1) setValue(`questionTypes.${index}.count`, val - 1);
                      }}
                      className="px-2.5 py-1 text-gray-500 hover:bg-gray-50 active:bg-gray-100 font-bold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      {...register(`questionTypes.${index}.count` as const, { valueAsNumber: true })}
                      className="w-10 text-center text-sm border-0 focus:outline-hidden font-semibold focus:ring-0 p-0"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = Number(watch(`questionTypes.${index}.count`)) || 0;
                        setValue(`questionTypes.${index}.count`, val + 1);
                      }}
                      className="px-2.5 py-1 text-gray-500 hover:bg-gray-50 active:bg-gray-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Marks per question stepper */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-12 text-right">Marks:</span>
                  <div className="flex items-center border border-gray-255 bg-white rounded-lg overflow-hidden h-9">
                    <button
                      type="button"
                      onClick={() => {
                        const val = Number(watch(`questionTypes.${index}.marks`)) || 0;
                        if (val > 1) setValue(`questionTypes.${index}.marks`, val - 1);
                      }}
                      className="px-2.5 py-1 text-gray-500 hover:bg-gray-50 active:bg-gray-100 font-bold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      {...register(`questionTypes.${index}.marks` as const, { valueAsNumber: true })}
                      className="w-10 text-center text-sm border-0 focus:outline-hidden font-semibold focus:ring-0 p-0"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = Number(watch(`questionTypes.${index}.marks`)) || 0;
                        setValue(`questionTypes.${index}.marks`, val + 1);
                      }}
                      className="px-2.5 py-1 text-gray-500 hover:bg-gray-50 active:bg-gray-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors ml-auto sm:ml-0"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}
          </div>

          {errors.questionTypes && (
            <span className="text-xs text-red-500 font-medium">{errors.questionTypes.message}</span>
          )}

          {/* Add Row and Totals Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <button
              type="button"
              onClick={() => append({ type: 'Multiple Choice Questions', count: 5, marks: 1 })}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-50 border border-gray-200 py-2 px-3.5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question Type</span>
            </button>

            {/* Sub-counters */}
            <div className="flex items-center gap-6 text-right sm:ml-auto">
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-gray-400 uppercase">Total Questions</span>
                <span className="text-base font-bold text-gray-800">{totalQuestions}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-gray-400 uppercase">Total Marks</span>
                <span className="text-base font-bold text-gray-800">{totalMarks}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional instructions */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Additional Instructions (Optional)</label>
          <textarea
            rows={3}
            placeholder="e.g. Focus heavily on CBSE Grade 10 Electromagnetism NCERT chapters. Include basic circuits diagrams scenarios."
            {...register('additionalInstructions')}
            className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-gray-900"
          />
        </div>

      </div>

      {/* Back and Submit Actions */}
      <div className="flex items-center justify-between mt-2">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="btn-secondary py-3 px-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary py-3 px-7 disabled:opacity-55 disabled:cursor-not-allowed"
        >
          <span>{submitting ? 'Generating...' : 'Next'}</span>
          {!submitting && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </form>
  );
}

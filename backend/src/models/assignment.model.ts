import { Schema, model, Document } from 'mongoose';

export interface IQuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface IQuestion {
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  answer?: string;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IExamPaper {
  schoolName: string;
  subject: string;
  timeAllowed: string;
  maxMarks: number;
  sections: ISection[];
}

export interface IAssignment extends Document {
  subject: string;
  dueDate: Date;
  fileUrl?: string;
  questionTypes: IQuestionType[];
  additionalInstructions?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  progressMessage: string;
  result?: IExamPaper;
  createdAt: Date;
}

const QuestionTypeSchema = new Schema<IQuestionType>({
  type: { type: String, required: true },
  count: { type: Number, required: true, min: 1 },
  marks: { type: Number, required: true, min: 1 }
}, { _id: false });

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  marks: { type: Number, required: true },
  answer: { type: String }
}, { _id: false });

const SectionSchema = new Schema<ISection>({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questions: [QuestionSchema]
}, { _id: false });

const ExamPaperSchema = new Schema<IExamPaper>({
  schoolName: { type: String, required: true },
  subject: { type: String, required: true },
  timeAllowed: { type: String, required: true },
  maxMarks: { type: Number, required: true },
  sections: [SectionSchema]
}, { _id: false });

const AssignmentSchema = new Schema<IAssignment>({
  subject: { type: String, required: true },
  dueDate: { type: Date, required: true },
  fileUrl: { type: String },
  questionTypes: { type: [QuestionTypeSchema], required: true },
  additionalInstructions: { type: String },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  progress: { type: Number, default: 0 },
  progressMessage: { type: String, default: 'Created' },
  result: { type: ExamPaperSchema },
  createdAt: { type: Date, default: Date.now }
});

export const Assignment = model<IAssignment>('Assignment', AssignmentSchema);

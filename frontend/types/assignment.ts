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

export interface IAssignment {
  _id: string;
  subject: string;
  dueDate: string;
  fileUrl?: string;
  questionTypes: IQuestionType[];
  additionalInstructions?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  progressMessage: string;
  result?: IExamPaper;
  createdAt: string;
}

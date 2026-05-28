import { IQuestionType } from '../models/assignment.model';

export const buildOpenAIPrompt = (
  subject: string,
  questionTypes: IQuestionType[],
  additionalInstructions?: string
): string => {
  const typesText = questionTypes
    .map(t => `- ${t.type}: ${t.count} questions, ${t.marks} marks each`)
    .join('\n');

  const totalMarks = questionTypes.reduce((sum, t) => sum + (t.count * t.marks), 0);

  return `You are an expert assessment designer. Create a professional, academic question paper for the subject: "${subject}".

The question paper MUST strictly contain the following question breakdown:
${typesText}

Total Marks: ${totalMarks}

${additionalInstructions ? `Additional Context/Instructions:\n"${additionalInstructions}"` : ''}

You must return a valid JSON object matching the JSON schema below. Do not wrap the JSON output in markdown tags (like \`\`\`json). The output must be pure raw JSON.

JSON Schema:
{
  "schoolName": "Delhi Public School, Bokaro",
  "subject": "${subject}",
  "timeAllowed": "90 minutes",
  "maxMarks": ${totalMarks},
  "sections": [
    {
      "title": "Section A",
      "instruction": "Answer all the questions in this section",
      "questions": [
        {
          "question": "What is the primary function of ...?",
          "difficulty": "Easy", // Must be "Easy" | "Medium" | "Hard"
          "marks": 2,
          "answer": "The primary function is to..." // Detailed correct answer for key
        }
      ]
    }
  ]
}

Rules for Question Generation:
1. For MCQ (Multiple Choice Questions) types: Include options directly in the question string. Format them like: "What is 2+2?\\nA) 3\\nB) 4\\nC) 5\\nD) 6"
2. For Numerical problems: Provide clear formulas and solve them step-by-step in the 'answer' field.
3. For Diagram/Graph questions: Describe a diagram-based scenario or graph-based prompt clearly (e.g., "Analyze the given diagram of a circuit...").
4. Assign difficulty ratings ("Easy", "Medium", "Hard") logically across questions to test different cognitive levels.
5. Ensure the total marks for the questions generated matches exactly the requested sum of ${totalMarks} marks.
6. Provide high-quality academic questions suitable for the specified subject.`;
};

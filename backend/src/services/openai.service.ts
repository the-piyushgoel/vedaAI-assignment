import dotenv from "dotenv";
dotenv.config();

console.log("KEY:", process.env.OPENAI_API_KEY);

import { OpenAI } from 'openai';
import { IExamPaper } from '../models/assignment.model';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
});

export const generateExamPaper = async (prompt: string, totalMarks: number): Promise<IExamPaper> => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your_openai_api_key_here' || apiKey.trim() === '') {
    console.warn('OpenAI API Key is missing. Using mock data for demo mode.');
    // Delay slightly to simulate AI generation latency
    await new Promise(resolve => setTimeout(resolve, 3000));
    return getMockExamPaper(prompt, totalMarks);
  }

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await openai.chat.completions.create({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an assessment creation assistant. You must respond with raw JSON that conforms to the requested schema. Do not add markdown backticks.'
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      }, {
        timeout: 45000
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response content received from OpenAI.');
      }

      const parsed: IExamPaper = JSON.parse(content);
      if (!parsed.sections || !Array.isArray(parsed.sections)) {
        throw new Error('Invalid JSON format: missing sections array.');
      }

      return parsed;
    } catch (error) {
      retries--;
      console.error(`Error calling OpenAI (Retries remaining: ${retries}):`, error);
      if (retries === 0) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  throw new Error('Failed to generate exam paper from OpenAI after multiple retries.');
};

const getMockExamPaper = (prompt: string, totalMarks: number): IExamPaper => {
  // Determine standard categories based on prompt contents
  const isTech = prompt.toLowerCase().includes('dbms') || prompt.toLowerCase().includes('computer') || prompt.toLowerCase().includes('science');

  if (isTech) {
    return {
      schoolName: 'Delhi Public School, Bokaro Steel City',
      subject: 'Computer Science (DBMS & SQL)',
      timeAllowed: '45 minutes',
      maxMarks: totalMarks,
      sections: [
        {
          title: 'Section A (MCQs)',
          instruction: 'Choose the correct option. Each question carries 2 marks.',
          questions: [
            {
              question: 'Which of the following is used to uniquely identify a tuple in a relation?\nA) Primary Key\nB) Foreign Key\nC) Local Key\nD) Alternate Key',
              difficulty: 'Easy',
              marks: 2,
              answer: 'A) Primary Key. A primary key uniquely identifies each record/tuple in a database table.'
            },
            {
              question: 'What does SQL stand for?\nA) Simple Query Language\nB) Structured Query Language\nC) System Query Language\nD) Standard Query Language',
              difficulty: 'Easy',
              marks: 2,
              answer: 'B) Structured Query Language. SQL is the standard language for relational database management systems.'
            }
          ]
        },
        {
          title: 'Section B (Short Answer Questions)',
          instruction: 'Answer all questions briefly. Each question carries 3 marks.',
          questions: [
            {
              question: 'Define Database Management System (DBMS) and write two advantages of using it.',
              difficulty: 'Medium',
              marks: 3,
              answer: 'A DBMS is software used to manage databases. Advantages include:\n1. Reduction of data redundancy (duplication).\n2. Enhanced data sharing, security, and integrity.'
            },
            {
              question: 'What is the difference between DDL and DML commands in SQL? Provide one example of each.',
              difficulty: 'Medium',
              marks: 3,
              answer: '1. DDL (Data Definition Language) commands define or modify database structure. Example: CREATE, ALTER, DROP.\n2. DML (Data Manipulation Language) commands manipulate data within tables. Example: SELECT, INSERT, UPDATE, DELETE.'
            }
          ]
        },
        {
          title: 'Section C (Long & Numerical Questions)',
          instruction: 'Provide detailed explanations or write queries. Each question carries 5 marks.',
          questions: [
            {
              question: 'Explain 1NF, 2NF, and 3NF normalization rules with a simple table scenario.',
              difficulty: 'Hard',
              marks: 5,
              answer: '1. 1NF: Atomic values only, no repeating groups.\n2. 2NF: Must be in 1NF, and all non-key attributes must be fully functionally dependent on the primary key (no partial dependency).\n3. 3NF: Must be in 2NF, and no transitive dependency exists (non-key fields should not depend on other non-key fields).'
            },
            {
              question: 'Consider a table "Employees (EmpID, Name, Salary, Dept)". Write SQL queries to:\n1. Find the highest salary.\n2. List employees earning more than 50,000.',
              difficulty: 'Hard',
              marks: 5,
              answer: '1. Highest Salary:\nSELECT MAX(Salary) FROM Employees;\n\n2. List Employees with salary > 50,000:\nSELECT Name, Salary FROM Employees WHERE Salary > 50000;'
            }
          ]
        }
      ]
    };
  }

  // Default Science/Electricity paper
  return {
    schoolName: 'Delhi Public School, Bokaro Steel City',
    subject: 'Science (Electricity & Circuits)',
    timeAllowed: '45 minutes',
    maxMarks: totalMarks,
    sections: [
      {
        title: 'Section A (MCQs)',
        instruction: 'Attempt all questions. Each question carries 2 marks.',
        questions: [
          {
            question: 'What is the SI unit of electric current?\nA) Ohm\nB) Volt\nC) Ampere\nD) Watt',
            difficulty: 'Easy',
            marks: 2,
            answer: 'C) Ampere. The SI unit of electric current is the Ampere (A).'
          },
          {
            question: 'Which of the following materials is an electrical insulator?\nA) Copper\nB) Rubber\nC) Iron\nD) Aluminium',
            difficulty: 'Easy',
            marks: 2,
            answer: 'B) Rubber. Rubber does not let electrical current flow easily, making it a good insulator.'
          }
        ]
      },
      {
        title: 'Section B (Short Answer Questions)',
        instruction: 'Answer all questions. Each question carries 3 marks.',
        questions: [
          {
            question: 'State Ohm\'s Law and write its mathematical equation.',
            difficulty: 'Medium',
            marks: 3,
            answer: 'Ohm\'s Law states that current is directly proportional to voltage across a conductor at constant temperature.\nFormula: V = I * R (where V is Voltage, I is Current, R is Resistance).'
          },
          {
            question: 'Explain the difference between a conductor and an insulator. Give one example of each.',
            difficulty: 'Medium',
            marks: 3,
            answer: '1. Conductors allow electric current to pass through them freely. Example: Copper, Iron.\n2. Insulators resist the flow of current. Example: Wood, Plastic.'
          }
        ]
      },
      {
        title: 'Section C (Numerical / Long Questions)',
        instruction: 'Show all steps of calculations. Each question carries 5 marks.',
        questions: [
          {
            question: 'A bulb of resistance 40 ohms is connected to a 120V battery source. Find the current flowing through the circuit.',
            difficulty: 'Hard',
            marks: 5,
            answer: 'Given:\nResistance (R) = 40 ohms\nVoltage (V) = 120 V\nUsing Ohm\'s Law: I = V / R\nI = 120 / 40 = 3 A.\nThe current flowing through the circuit is 3 Amperes.'
          },
          {
            question: 'Describe how a simple electric circuit is set up. Detail the role of a battery, a switch, and conducting wires.',
            difficulty: 'Hard',
            marks: 5,
            answer: 'An electric circuit is a closed path for current. It consists of:\n1. Battery: Provides the potential difference (voltage source).\n2. Switch: Allows closing or breaking the circuit connection.\n3. Wires: Conduct the current through the path.\n4. Load (e.g. bulb): Consumes energy and converts it to light/heat.'
          }
        ]
      }
    ]
  };
};

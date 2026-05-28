'use client';

import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  PDFDownloadLink 
} from '@react-pdf/renderer';
import { IExamPaper } from '@/types/assignment';
import { Download, Loader2 } from 'lucide-react';

// Create PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Times-Roman',
    fontSize: 12,
    lineHeight: 1.5,
    color: '#111827'
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#9ca3af',
    borderBottomStyle: 'dashed',
    paddingBottom: 10,
    marginBottom: 10,
    alignItems: 'center'
  },
  schoolName: {
    fontSize: 18,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    color: '#374151'
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#111827',
    marginBottom: 10,
    fontFamily: 'Times-Bold'
  },
  metaText: {
    fontSize: 11
  },
  instructions: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#4b5563',
    marginBottom: 15
  },
  studentBox: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  studentField: {
    fontSize: 10,
    color: '#374151'
  },
  sectionHeader: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 4,
    marginVertical: 10
  },
  sectionInstruction: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#6b7280',
    marginBottom: 8,
    paddingLeft: 4
  },
  questionRow: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingLeft: 5,
    paddingRight: 5
  },
  qIndex: {
    width: 20,
    fontFamily: 'Times-Bold'
  },
  qBody: {
    flex: 1,
    paddingRight: 20
  },
  qText: {
    fontSize: 11
  },
  qDifficulty: {
    fontSize: 9,
    fontFamily: 'Times-Bold',
    color: '#6b7280',
    marginBottom: 2
  },
  qMarks: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    width: 50,
    textAlign: 'right'
  },
  // Answer Key styling
  keyContainer: {
    marginTop: 30,
    borderTopWidth: 2,
    borderTopColor: '#9ca3af',
    borderTopStyle: 'dashed',
    paddingTop: 15
  },
  keyTitle: {
    fontSize: 14,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 15
  },
  keySectionTitle: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    color: '#4b5563',
    textTransform: 'uppercase',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 2
  },
  answerRow: {
    marginBottom: 15,
    paddingLeft: 5
  },
  answerText: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    marginBottom: 4
  },
  answerSolution: {
    fontSize: 10,
    color: '#4b5563',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    padding: 8
  }
});

// PDF Document structure
const ExamPaperPDF = ({ paper }: { paper: IExamPaper }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.schoolName}>{paper.schoolName || 'Delhi Public School, Bokaro'}</Text>
        <Text style={styles.subtitle}>Subject: {paper.subject}  |  Class: 10th Standard</Text>
      </View>

      {/* Meta Row */}
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Time allowed: {paper.timeAllowed || '45 minutes'}</Text>
        <Text style={styles.metaText}>Maximum Marks: {paper.maxMarks || 20}</Text>
      </View>

      {/* General Instructions */}
      <Text style={styles.instructions}>All questions are compulsory unless stated otherwise.</Text>

      {/* Student Details box */}
      <View style={styles.studentBox}>
        <Text style={styles.studentField}>Student Name: _______________________</Text>
        <Text style={styles.studentField}>Roll Number: ______________</Text>
        <Text style={styles.studentField}>Class / Sec: ________</Text>
      </View>

      {/* Questions list */}
      {paper.sections.map((section, sIdx) => (
        <View key={sIdx} wrap={true}>
          <Text style={styles.sectionHeader}>{section.title}</Text>
          {section.instruction && <Text style={styles.sectionInstruction}>{section.instruction}</Text>}
          
          {section.questions.map((q, qIdx) => (
            <View key={qIdx} style={styles.questionRow} wrap={false}>
              <Text style={styles.qIndex}>{qIdx + 1}.</Text>
              <View style={styles.qBody}>
                <Text style={styles.qDifficulty}>[{q.difficulty}]</Text>
                <Text style={styles.qText}>{q.question}</Text>
              </View>
              <Text style={styles.qMarks}>[{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]</Text>
            </View>
          ))}
        </View>
      ))}
    </Page>

    {/* Answer Key Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.keyContainer}>
        <Text style={styles.keyTitle}>Answer Key (For Teacher Reference)</Text>

        {paper.sections.map((section, sIdx) => (
          <View key={sIdx} wrap={true} style={{ marginBottom: 15 }}>
            <Text style={styles.keySectionTitle}>{section.title} - Solutions</Text>
            
            {section.questions.map((q, qIdx) => (
              <View key={qIdx} style={styles.answerRow} wrap={false}>
                <Text style={styles.answerText}>{qIdx + 1}. {q.question.split('\n')[0]} ...</Text>
                <Text style={styles.answerSolution}>{q.answer || 'Provide answer key detail description.'}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

interface PDFDownloadProps {
  paper: IExamPaper;
  fileName?: string;
}

export default function PDFDownload({ paper, fileName = 'VedaAI_Assessment.pdf' }: PDFDownloadProps) {
  return (
    <PDFDownloadLink document={<ExamPaperPDF paper={paper} />} fileName={fileName}>
      {/* Helper render method */}
      {({ loading }) => (
        <button
          disabled={loading}
          className="flex items-center gap-2 bg-[#111827] text-white hover:bg-gray-800 disabled:bg-gray-400 transition-colors py-3 px-6 rounded-full font-semibold text-sm shadow-md"
        >
          {loading ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4.5 h-4.5" />
              <span>Download PDF</span>
            </>
          )}
        </button>
      )}
    </PDFDownloadLink>
  );
}

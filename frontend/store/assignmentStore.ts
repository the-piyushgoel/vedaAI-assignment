import { create } from 'zustand';
import { IAssignment } from '../types/assignment';
import { assignmentService } from '../services/assignment.service';

interface AssignmentState {
  assignments: IAssignment[];
  currentAssignment: IAssignment | null;
  loading: boolean;
  error: string | null;
  fetchAssignments: () => Promise<void>;
  fetchAssignmentById: (id: string) => Promise<IAssignment | null>;
  createAssignment: (data: {
    subject: string;
    dueDate: string;
    fileUrl?: string;
    questionTypes: { type: string; count: number; marks: number }[];
    additionalInstructions?: string;
  }) => Promise<IAssignment>;
  deleteAssignment: (id: string) => Promise<void>;
  updateAssignmentProgress: (assignmentId: string, progress: number, progressMessage: string) => void;
  setAssignmentStatus: (assignmentId: string, status: IAssignment['status'], result?: any) => void;
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  assignments: [],
  currentAssignment: null,
  loading: false,
  error: null,

  fetchAssignments: async () => {
    set({ loading: true, error: null });
    try {
      const data = await assignmentService.getAll();
      set({ assignments: data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch assignments', loading: false });
    }
  },

  fetchAssignmentById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const data = await assignmentService.getById(id);
      set({ currentAssignment: data, loading: false });
      return data;
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch assignment details', loading: false });
      return null;
    }
  },

  createAssignment: async (data) => {
    set({ loading: true, error: null });
    try {
      const newAssignment = await assignmentService.create(data);
      set((state) => ({
        assignments: [newAssignment, ...state.assignments],
        currentAssignment: newAssignment,
        loading: false
      }));
      return newAssignment;
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to create assignment', loading: false });
      throw err;
    }
  },

  deleteAssignment: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await assignmentService.delete(id);
      set((state) => ({
        assignments: state.assignments.filter((a) => a._id !== id),
        currentAssignment: state.currentAssignment?._id === id ? null : state.currentAssignment,
        loading: false
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to delete assignment', loading: false });
    }
  },

  updateAssignmentProgress: (assignmentId, progress, progressMessage) => {
    set((state) => {
      const updatedAssignments = state.assignments.map((a) =>
        a._id === assignmentId ? { ...a, progress, progressMessage, status: 'processing' as const } : a
      );
      const updatedCurrent =
        state.currentAssignment?._id === assignmentId
          ? { ...state.currentAssignment, progress, progressMessage, status: 'processing' as const }
          : state.currentAssignment;

      return {
        assignments: updatedAssignments,
        currentAssignment: updatedCurrent
      };
    });
  },

  setAssignmentStatus: (assignmentId, status, result) => {
    set((state) => {
      const updatedAssignments = state.assignments.map((a) =>
        a._id === assignmentId ? { ...a, status, ...(result ? { result } : {}) } : a
      );
      const updatedCurrent =
        state.currentAssignment?._id === assignmentId
          ? { ...state.currentAssignment, status, ...(result ? { result } : {}) }
          : state.currentAssignment;

      return {
        assignments: updatedAssignments,
        currentAssignment: updatedCurrent
      };
    });
  }
}));

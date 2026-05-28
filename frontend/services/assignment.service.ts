import { apiClient } from './api';
import { IAssignment } from '../types/assignment';

export const assignmentService = {
  async getAll(): Promise<IAssignment[]> {
    const response = await apiClient.get<IAssignment[]>('/assignments');
    return response.data;
  },

  async getById(id: string): Promise<IAssignment> {
    const response = await apiClient.get<IAssignment>(`/assignments/${id}`);
    return response.data;
  },

  async create(data: {
    subject: string;
    dueDate: string;
    fileUrl?: string;
    questionTypes: { type: string; count: number; marks: number }[];
    additionalInstructions?: string;
  }): Promise<IAssignment> {
    const response = await apiClient.post<IAssignment>('/assignments/create', data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/assignments/${id}`);
  }
};

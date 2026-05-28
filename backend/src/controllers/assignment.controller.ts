import { Request, Response } from 'express';
import { Assignment } from '../models/assignment.model';
import { questionQueue } from '../queues/queue';

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { subject, dueDate, fileUrl, questionTypes, additionalInstructions } = req.body;

    if (!subject || !dueDate || !questionTypes || !Array.isArray(questionTypes) || questionTypes.length === 0) {
      return res.status(400).json({ error: 'Missing required parameters or questionTypes is empty.' });
    }

    // Create MongoDB entry
    const assignment = new Assignment({
      subject,
      dueDate: new Date(dueDate),
      fileUrl,
      questionTypes,
      additionalInstructions,
      status: 'pending',
      progress: 0,
      progressMessage: 'Queued'
    });

    await assignment.save();

    // Push job to BullMQ
    const job = await questionQueue.add('generate-paper', {
      assignmentId: assignment._id
    });

    console.log(`Enqueued generation job ${job.id} for assignment ${assignment._id}`);

    return res.status(201).json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    return res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    return res.json(assignment);
  } catch (error) {
    console.error('Error fetching assignment by ID:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByIdAndDelete(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    return res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

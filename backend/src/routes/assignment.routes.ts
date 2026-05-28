import { Router } from 'express';
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  deleteAssignment
} from '../controllers/assignment.controller';

const router = Router();

router.post('/create', createAssignment);
router.post('/generate', createAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignmentById);
router.delete('/:id', deleteAssignment);

export default router;

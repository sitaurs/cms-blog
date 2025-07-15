import express from 'express';
import {
  createComment,
  getComments,
  updateCommentStatus,
  deleteComment
} from '../controllers/commentController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

router.get('/', getComments);
router.post('/', authenticateToken, createComment);
router.put('/:id/status', authenticateToken, authorizeRoles('admin', 'editor'), updateCommentStatus);
router.delete('/:id', authenticateToken, deleteComment);

export default router;
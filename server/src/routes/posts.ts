import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getFeaturedPosts
} from '../controllers/postController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

router.get('/', getPosts);
router.get('/featured', getFeaturedPosts);
router.get('/:id', getPost);
router.post('/', authenticateToken, authorizeRoles('admin', 'editor'), createPost);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'editor'), updatePost);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'editor'), deletePost);

export default router;
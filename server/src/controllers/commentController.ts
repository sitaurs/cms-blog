import { Request, Response } from 'express';
import Comment, { IComment } from '../models/Comment';
import { IUser } from '../models/User';
import { validationResult } from 'express-validator';

interface AuthRequest extends Request {
  user?: IUser;
}

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, post, parentComment } = req.body;

    const comment = new Comment({
      content,
      author: req.user!._id,
      post,
      parentComment: parentComment || undefined,
      status: req.user!.role === 'admin' ? 'approved' : 'pending'
    });

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username firstName lastName avatar')
      .populate('post', 'title slug');

    res.status(201).json({
      message: 'Comment created successfully',
      comment: populatedComment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    
    if (req.query.post) {
      filter.post = req.query.post;
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Only show top-level comments for public view
    if (req.query.post && !req.query.showAll) {
      filter.parentComment = { $exists: false };
    }

    const comments = await Comment.find(filter)
      .populate('author', 'username firstName lastName avatar')
      .populate('post', 'title slug')
      .populate('replies')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments(filter);

    res.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCommentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('author', 'username firstName lastName avatar');

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({
      message: 'Comment status updated successfully',
      comment
    });
  } catch (error) {
    console.error('Update comment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is author or admin/editor
    if (comment.author.toString() !== req.user!._id.toString() && 
        !['admin', 'editor'].includes(req.user!.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
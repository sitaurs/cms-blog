import { Request, Response } from 'express';
import Post, { IPost } from '../models/Post';
import { IUser } from '../models/User';
import { validationResult } from 'express-validator';

interface AuthRequest extends Request {
  user?: IUser;
}

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const postData = {
      ...req.body,
      author: req.user!._id,
      slug: req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };

    if (postData.status === 'published' && !postData.publishedAt) {
      postData.publishedAt = new Date();
    }

    const post = new Post(postData);
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username firstName lastName avatar')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug color');

    res.status(201).json({
      message: 'Post created successfully',
      post: populatedPost
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.author) {
      filter.author = req.query.author;
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }

    const posts = await Post.find(filter)
      .populate('author', 'username firstName lastName avatar')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug color')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username firstName lastName avatar bio')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug color');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is author or admin/editor
    if (post.author.toString() !== req.user!._id.toString() && 
        !['admin', 'editor'].includes(req.user!.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updateData = { ...req.body };
    if (updateData.status === 'published' && !post.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'username firstName lastName avatar')
     .populate('category', 'name slug color')
     .populate('tags', 'name slug color');

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user!._id.toString() && 
        req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFeaturedPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ 
      status: 'published', 
      isFeature: true 
    })
      .populate('author', 'username firstName lastName avatar')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug color')
      .sort({ publishedAt: -1 })
      .limit(5);

    res.json({ posts });
  } catch (error) {
    console.error('Get featured posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
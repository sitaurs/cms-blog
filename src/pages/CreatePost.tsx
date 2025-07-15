import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Save, Eye, Send, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import SEOAnalyzer from '../components/SEOAnalyzer';
import RichTextEditor from '../components/RichTextEditor';

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '',
    tags: [],
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    isFeature: false,
    allowComments: true
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Mock data for now
      return [
        { _id: '1', name: 'Technology', slug: 'technology' },
        { _id: '2', name: 'Design', slug: 'design' },
        { _id: '3', name: 'Development', slug: 'development' }
      ];
    }
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const response = await api.post('/posts', postData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Post created successfully!');
      navigate('/admin/posts');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create post');
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = (status: string) => {
    if (!formData.title || !formData.content || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    createPostMutation.mutate({
      ...formData,
      status,
      publishedAt: status === 'published' ? new Date() : undefined
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/posts')}
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
              Create New Post
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Write and publish your blog post
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={createPostMutation.isPending}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={createPostMutation.isPending}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Publish</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Slug */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors duration-200"
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors duration-200"
                  placeholder="post-slug"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Excerpt *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors duration-200"
                  placeholder="Brief description of your post"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Content *
                </label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content: string) => setFormData(prev => ({ ...prev, content }))}
                  className="min-h-[300px]"
                  placeholder="Write your post content here..."
                />
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
              SEO Settings
            </h3>
            <SEOAnalyzer
              title={formData.title}
              content={formData.content}
              excerpt={formData.excerpt}
              seo={{
                title: formData.seoTitle,
                description: formData.seoDescription,
                keywords: formData.seoKeywords,
                focusKeyword: formData.seoKeywords?.[0] || ''
              }}
              onScoreUpdate={(score: number) => {
                // Optionally handle SEO score updates here
              }}
            />
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors duration-200"
                  placeholder="SEO optimized title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  SEO Description
                </label>
                <textarea
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors duration-200"
                  placeholder="SEO meta description"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Featured Image
            </h3>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
              <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                Upload featured image
              </p>
              <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200">
                Choose File
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Category *
            </h3>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors duration-200"
            >
              <option value="">Select Category</option>
              {categories?.map((category: any) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Post Settings */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Post Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeature"
                  checked={formData.isFeature}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                />
                <label className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                  Featured Post
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="allowComments"
                  checked={formData.allowComments}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                />
                <label className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                  Allow Comments
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

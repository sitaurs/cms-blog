import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  MessageCircle, 
  Check, 
  X, 
  Reply, 
  MoreHorizontal, 
  Search,
  Filter 
} from 'lucide-react';
import { format } from 'date-fns';

const Comments: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const comments = [
    {
      _id: '1',
      content: 'Great article! Really helpful insights about modern web development.',
      author: { firstName: 'John', lastName: 'Doe', avatar: null },
      post: { title: 'Modern Web Development Guide', slug: 'modern-web-dev' },
      status: 'pending',
      createdAt: new Date().toISOString(),
      replies: []
    },
    {
      _id: '2',
      content: 'I disagree with some points, but overall a good read.',
      author: { firstName: 'Jane', lastName: 'Smith', avatar: null },
      post: { title: 'React Best Practices', slug: 'react-best-practices' },
      status: 'approved',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      replies: []
    },
    {
      _id: '3',
      content: 'This content is spam and inappropriate.',
      author: { firstName: 'Spam', lastName: 'Bot', avatar: null },
      post: { title: 'TypeScript Tutorial', slug: 'typescript-tutorial' },
      status: 'rejected',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      replies: []
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: MessageCircle },
      approved: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: Check },
      rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: X }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || MessageCircle;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleStatusChange = (commentId: string, newStatus: string) => {
    console.log('Updating comment status:', commentId, newStatus);
    // Implement status update logic here
  };

  const filteredComments = comments.filter(comment => {
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Comments
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Moderate and manage user comments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {comments.filter(c => c.status === 'pending').length} pending approval
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white dark:focus:bg-slate-600 transition-colors duration-200"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
            >
              <option value="all">All Comments</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {filteredComments.length} comments
            </span>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div
            key={comment._id}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {comment.author.firstName[0]}{comment.author.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {comment.author.firstName} {comment.author.lastName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {format(new Date(comment.createdAt), 'MMM d, yyyy at h:mm a')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(comment.status)}
                <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-slate-700 dark:text-slate-300 mb-2">
                {comment.content}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                On: <span className="font-medium">{comment.post.title}</span>
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {comment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(comment._id, 'approved')}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors duration-200 flex items-center space-x-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(comment._id, 'rejected')}
                      className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors duration-200 flex items-center space-x-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Reject</span>
                    </button>
                  </>
                )}
                {comment.status === 'approved' && (
                  <button
                    onClick={() => handleStatusChange(comment._id, 'rejected')}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Reject</span>
                  </button>
                )}
                {comment.status === 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(comment._id, 'approved')}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Approve</span>
                  </button>
                )}
              </div>
              <button className="p-2 text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                <Reply className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredComments.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
            No comments found
          </h3>
          <p className="text-slate-500 dark:text-slate-500">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
};

export default Comments;
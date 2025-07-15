import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, 
  MessageCircle, 
  Users, 
  Eye, 
  TrendingUp, 
  Calendar,
  PlusCircle,
  Activity
} from 'lucide-react';
import { api } from '../services/api';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Mock data for now
      return {
        posts: { total: 24, published: 18, drafts: 6 },
        comments: { total: 156, pending: 8, approved: 148 },
        users: { total: 42, active: 38, inactive: 4 },
        views: { total: 15420, thisMonth: 2840, growth: 12.5 }
      };
    }
  });

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    subValue, 
    growth 
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    subValue?: string;
    growth?: number;
  }) => (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {growth && (
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">
              +{growth}%
            </span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">
        {value}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm">
        {title}
      </p>
      {subValue && (
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
          {subValue}
        </p>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Welcome back! Here's what's happening with your blog.
          </p>
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2">
          <PlusCircle className="w-5 h-5" />
          <span>New Post</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Posts"
          value={stats?.posts.total || 0}
          icon={FileText}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          subValue={`${stats?.posts.published} published, ${stats?.posts.drafts} drafts`}
        />
        <StatCard
          title="Comments"
          value={stats?.comments.total || 0}
          icon={MessageCircle}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          subValue={`${stats?.comments.pending} pending approval`}
        />
        <StatCard
          title="Users"
          value={stats?.users.total || 0}
          icon={Users}
          color="bg-gradient-to-r from-green-500 to-green-600"
          subValue={`${stats?.users.active} active users`}
        />
        <StatCard
          title="Total Views"
          value={stats?.views.total || 0}
          icon={Eye}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          subValue={`${stats?.views.thisMonth} this month`}
          growth={stats?.views.growth}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              Recent Posts
            </h2>
            <Activity className="w-5 h-5 text-slate-500" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Sample Post Title {i}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {i} hours ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              Recent Comments
            </h2>
            <MessageCircle className="w-5 h-5 text-slate-500" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">U{i}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    User {i} commented on "Sample Post"
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {i * 2} hours ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all duration-200">
            <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
            <h3 className="font-medium text-slate-800 dark:text-slate-200">Create Post</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Write a new blog post</p>
          </button>
          <button className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:from-green-100 hover:to-teal-100 dark:hover:from-green-900/30 dark:hover:to-teal-900/30 transition-all duration-200">
            <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
            <h3 className="font-medium text-slate-800 dark:text-slate-200">Moderate Comments</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Review pending comments</p>
          </button>
          <button className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800 hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/30 dark:hover:to-red-900/30 transition-all duration-200">
            <Users className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
            <h3 className="font-medium text-slate-800 dark:text-slate-200">Manage Users</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">User administration</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
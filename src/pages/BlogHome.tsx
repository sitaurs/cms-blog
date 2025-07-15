import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  ArrowRight, 
  Search,
  Moon,
  Sun
} from 'lucide-react';

const BlogHome: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // Mock data
  const featuredPosts = [
    {
      _id: '1',
      title: 'Getting Started with Modern Web Development',
      excerpt: 'Learn the fundamentals of modern web development with React, TypeScript, and Node.js.',
      featuredImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: { firstName: 'John', lastName: 'Doe' },
      category: { name: 'Technology', color: '#8B5CF6' },
      publishedAt: new Date().toISOString(),
      readTime: '5 min read'
    },
    {
      _id: '2',
      title: 'The Future of Artificial Intelligence',
      excerpt: 'Exploring how AI is transforming industries and what it means for the future.',
      featuredImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: { firstName: 'Jane', lastName: 'Smith' },
      category: { name: 'AI', color: '#3B82F6' },
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      readTime: '8 min read'
    },
    {
      _id: '3',
      title: 'Design Systems for Modern Applications',
      excerpt: 'Building scalable and maintainable design systems for your applications.',
      featuredImage: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: { firstName: 'Mike', lastName: 'Johnson' },
      category: { name: 'Design', color: '#10B981' },
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      readTime: '6 min read'
    }
  ];

  const recentPosts = [
    {
      _id: '4',
      title: 'Understanding TypeScript Generics',
      excerpt: 'A comprehensive guide to TypeScript generics and how to use them effectively.',
      author: { firstName: 'Sarah', lastName: 'Wilson' },
      category: { name: 'Development', color: '#F59E0B' },
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      readTime: '4 min read'
    },
    {
      _id: '5',
      title: 'CSS Grid vs Flexbox: When to Use What',
      excerpt: 'Learn when to use CSS Grid vs Flexbox for your layout needs.',
      author: { firstName: 'David', lastName: 'Brown' },
      category: { name: 'CSS', color: '#EF4444' },
      publishedAt: new Date(Date.now() - 345600000).toISOString(),
      readTime: '3 min read'
    },
    {
      _id: '6',
      title: 'Building RESTful APIs with Node.js',
      excerpt: 'Step-by-step guide to building robust RESTful APIs using Node.js and Express.',
      author: { firstName: 'Emily', lastName: 'Davis' },
      category: { name: 'Backend', color: '#8B5CF6' },
      publishedAt: new Date(Date.now() - 432000000).toISOString(),
      readTime: '7 min read'
    }
  ];

  const categories = [
    { name: 'Technology', color: '#8B5CF6', count: 12 },
    { name: 'Design', color: '#3B82F6', count: 8 },
    { name: 'Development', color: '#10B981', count: 15 },
    { name: 'AI', color: '#F59E0B', count: 5 }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                BlogCMS
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link to="/" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                  Home
                </Link>
                <Link to="/categories" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                  Categories
                </Link>
                <Link to="/about" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                  About
                </Link>
                <Link to="/contact" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                  Contact
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white dark:focus:bg-slate-600 transition-colors duration-200"
                />
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                ) : (
                  <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                )}
              </button>
              <Link
                to="/login"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-slate-800 dark:text-slate-200 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                BlogCMS
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Discover insightful articles, tutorials, and thoughts on modern web development,
              design, and technology. Stay updated with the latest trends and best practices.
            </p>
          </div>

          {/* Featured Posts */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-8 text-center">
              Featured Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <article
                  key={post._id}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: post.category.color }}
                      >
                        {post.category.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {post.author.firstName} {post.author.lastName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/blog/${post._id}`}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Recent Posts and Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Posts */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-8">
                Recent Posts
              </h2>
              <div className="space-y-8">
                {recentPosts.map((post) => (
                  <article
                    key={post._id}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: post.category.color }}
                          >
                            {post.category.name}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {formatDate(post.publishedAt)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {post.author.firstName} {post.author.lastName}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {post.readTime}
                              </span>
                            </div>
                          </div>
                          <Link
                            to={`/blog/${post._id}`}
                            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200 flex items-center space-x-1"
                          >
                            <span>Read More</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Categories */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                  Categories
                </h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={`/category/${category.name.toLowerCase()}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-slate-700 dark:text-slate-300">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {category.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">
                  Stay Updated
                </h3>
                <p className="text-purple-100 mb-4">
                  Subscribe to our newsletter for the latest posts and updates.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button
                    type="submit"
                    className="w-full bg-white text-purple-600 px-4 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors duration-200"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                BlogCMS
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md">
                A modern content management system for bloggers and content creators.
                Built with the latest technologies and best practices.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                Admin
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              © 2024 BlogCMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogHome;
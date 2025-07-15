import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../contexts/ThemeContext';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  Eye,
  Heart,
  Share2,
  Moon,
  Sun
} from 'lucide-react';
import { format } from 'date-fns';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { theme, toggleTheme } = useTheme();

  // Mock data - in real app, this would fetch from API
  const post = {
    _id: '1',
    title: 'Getting Started with Modern Web Development',
    content: `
      <p>Modern web development has evolved significantly over the past decade. With the rise of frameworks like React, Vue, and Angular, developers now have powerful tools at their disposal to create dynamic, interactive applications.</p>
      
      <h2>The Modern Stack</h2>
      <p>Today's web development stack typically includes:</p>
      <ul>
        <li><strong>Frontend:</strong> React, Vue, or Angular with TypeScript</li>
        <li><strong>Backend:</strong> Node.js, Python, or Go</li>
        <li><strong>Database:</strong> MongoDB, PostgreSQL, or MySQL</li>
        <li><strong>Deployment:</strong> Vercel, Netlify, or AWS</li>
      </ul>
      
      <h2>Key Technologies</h2>
      <p>Let's explore some of the key technologies that are shaping modern web development:</p>
      
      <h3>React and TypeScript</h3>
      <p>React has become the go-to library for building user interfaces, and when combined with TypeScript, it provides a robust development experience with type safety and excellent tooling.</p>
      
      <h3>Next.js</h3>
      <p>Next.js has revolutionized React development by providing server-side rendering, static site generation, and many other features out of the box.</p>
      
      <h3>Tailwind CSS</h3>
      <p>Tailwind CSS offers a utility-first approach to styling, making it easier to create consistent and responsive designs.</p>
      
      <h2>Best Practices</h2>
      <p>Here are some best practices for modern web development:</p>
      <ol>
        <li>Use TypeScript for type safety</li>
        <li>Implement proper error handling</li>
        <li>Follow responsive design principles</li>
        <li>Optimize for performance</li>
        <li>Write comprehensive tests</li>
      </ol>
      
      <h2>Conclusion</h2>
      <p>Modern web development is an exciting field with constantly evolving technologies. By staying up-to-date with the latest trends and best practices, developers can build amazing applications that provide great user experiences.</p>
    `,
    excerpt: 'Learn the fundamentals of modern web development with React, TypeScript, and Node.js.',
    featuredImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1200',
    author: { firstName: 'John', lastName: 'Doe', bio: 'Full-stack developer and tech enthusiast' },
    category: { name: 'Technology', color: '#8B5CF6' },
    tags: [
      { name: 'React', color: '#61DAFB' },
      { name: 'TypeScript', color: '#3178C6' },
      { name: 'Web Development', color: '#FF6B6B' }
    ],
    publishedAt: new Date().toISOString(),
    views: 1420,
    likes: 89,
    readTime: '5 min read'
  };

  const relatedPosts = [
    {
      _id: '2',
      title: 'Understanding TypeScript Generics',
      excerpt: 'A comprehensive guide to TypeScript generics and how to use them effectively.',
      featuredImage: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
      author: { firstName: 'Sarah', lastName: 'Wilson' },
      category: { name: 'Development', color: '#F59E0B' },
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      readTime: '4 min read'
    },
    {
      _id: '3',
      title: 'CSS Grid vs Flexbox',
      excerpt: 'Learn when to use CSS Grid vs Flexbox for your layout needs.',
      featuredImage: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      author: { firstName: 'Mike', lastName: 'Johnson' },
      category: { name: 'CSS', color: '#EF4444' },
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      readTime: '3 min read'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                BlogCMS
              </span>
            </Link>
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
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <span
              className="px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </span>
            <span className="text-slate-500 dark:text-slate-400">•</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {post.author.firstName[0]}{post.author.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {post.author.firstName} {post.author.lastName}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {post.author.bio}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
                <Heart className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
                <Share2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Content */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg mb-8">
          <div 
            className="prose prose-lg max-w-none dark:prose-invert prose-purple"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Tags */}
        <div className="flex items-center space-x-2 mb-8">
          <Tag className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag.name}
                to={`/tag/${tag.name.toLowerCase()}`}
                className="px-3 py-1 rounded-full text-sm font-medium text-white hover:opacity-80 transition-opacity duration-200"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Author Bio */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-medium">
                {post.author.firstName[0]}{post.author.lastName[0]}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                {post.author.firstName} {post.author.lastName}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {post.author.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">
            Related Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost._id}
                to={`/blog/${relatedPost._id}`}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <img
                  src={relatedPost.featuredImage}
                  alt={relatedPost.title}
                  className="w-full h-32 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: relatedPost.category.color }}
                  >
                    {relatedPost.category.name}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {format(new Date(relatedPost.publishedAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {relatedPost.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                  {relatedPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {relatedPost.author.firstName} {relatedPost.author.lastName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {relatedPost.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
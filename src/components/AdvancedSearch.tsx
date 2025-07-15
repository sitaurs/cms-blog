import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, Calendar, User, Tag, Folder } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import Fuse from 'fuse.js';

interface SearchResult {
  type: 'post' | 'category' | 'tag' | 'author';
  id: string;
  title: string;
  excerpt?: string;
  url: string;
  relevanceScore: number;
  highlightedText?: string;
  metadata?: {
    author?: string;
    category?: string;
    publishedAt?: string;
    tags?: string[];
  };
}

interface AdvancedSearchProps {
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onResultSelect,
  placeholder = "Search posts, categories, authors...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState({
    type: 'all',
    dateRange: 'all',
    category: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch search data
  const { data: searchData } = useQuery({
    queryKey: ['searchData'],
    queryFn: async () => {
      const [postsRes, categoriesRes] = await Promise.all([
        api.get('/posts?status=published'),
        api.get('/categories')
      ]);
      
      return {
        posts: postsRes.data.posts || [],
        categories: categoriesRes.data || []
      };
    }
  });

  // Initialize Fuse.js for fuzzy search
  const fuse = React.useMemo(() => {
    if (!searchData) return null;

    const searchItems = [
      ...searchData.posts.map((post: any) => ({
        type: 'post',
        id: post._id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        url: `/blog/${post.slug}`,
        metadata: {
          author: `${post.author?.firstName} ${post.author?.lastName}`,
          category: post.category?.name,
          publishedAt: post.publishedAt,
          tags: post.tags?.map((tag: any) => tag.name) || []
        }
      })),
      ...searchData.categories.map((category: any) => ({
        type: 'category',
        id: category._id,
        title: category.name,
        excerpt: category.description,
        url: `/category/${category.slug}`,
        metadata: {}
      }))
    ];

    return new Fuse(searchItems, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'excerpt', weight: 0.3 },
        { name: 'content', weight: 0.2 },
        { name: 'metadata.author', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    });
  }, [searchData]);

  // Perform search
  useEffect(() => {
    if (!query.trim() || !fuse) {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(query);
    const formattedResults: SearchResult[] = searchResults
      .map(result => ({
        ...result.item,
        relevanceScore: 1 - (result.score || 0),
        highlightedText: result.matches?.[0]?.value || ''
      }))
      .filter(result => {
        // Apply filters
        if (filters.type !== 'all' && result.type !== filters.type) return false;
        if (filters.category !== 'all' && result.metadata?.category !== filters.category) return false;
        
        if (filters.dateRange !== 'all' && result.metadata?.publishedAt) {
          const publishedDate = new Date(result.metadata.publishedAt);
          const now = new Date();
          const daysDiff = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24));
          
          switch (filters.dateRange) {
            case 'week':
              if (daysDiff > 7) return false;
              break;
            case 'month':
              if (daysDiff > 30) return false;
              break;
            case 'year':
              if (daysDiff > 365) return false;
              break;
          }
        }
        
        return true;
      })
      .slice(0, 10); // Limit to 10 results

    setResults(formattedResults);
  }, [query, fuse, filters]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    setIsOpen(false);
    setQuery('');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <Calendar className="w-4 h-4" />;
      case 'category':
        return <Folder className="w-4 h-4" />;
      case 'tag':
        return <Tag className="w-4 h-4" />;
      case 'author':
        return <User className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
            title="Search Filters"
          >
            <Filter className="h-5 w-5" />
          </button>
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
              title="Clear Search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Content Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="all">All Types</option>
                <option value="post">Posts</option>
                <option value="category">Categories</option>
                <option value="tag">Tags</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="all">All Time</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="year">Past Year</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="all">All Categories</option>
                {searchData?.categories.map((category: any) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-96 overflow-y-auto z-40">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1 text-slate-400">
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {highlightText(result.title, query)}
                        </h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                          {result.type}
                        </span>
                      </div>
                      {result.excerpt && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {highlightText(result.excerpt, query)}
                        </p>
                      )}
                      {result.metadata && (
                        <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                          {result.metadata.author && (
                            <span className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{result.metadata.author}</span>
                            </span>
                          )}
                          {result.metadata.category && (
                            <span className="flex items-center space-x-1">
                              <Folder className="w-3 h-3" />
                              <span>{result.metadata.category}</span>
                            </span>
                          )}
                          {result.metadata.publishedAt && (
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(result.metadata.publishedAt).toLocaleDateString()}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;

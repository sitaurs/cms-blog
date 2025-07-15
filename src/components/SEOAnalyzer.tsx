import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Target, Eye, Clock } from 'lucide-react';

interface SEOAnalyzerProps {
  title: string;
  content: string;
  excerpt: string;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
    focusKeyword?: string;
  };
  onScoreUpdate?: (score: number) => void;
}

interface SEOCheck {
  name: string;
  status: 'good' | 'warning' | 'error';
  message: string;
  score: number;
}

const SEOAnalyzer: React.FC<SEOAnalyzerProps> = ({
  title,
  content,
  excerpt,
  seo,
  onScoreUpdate
}) => {
  const [seoChecks, setSeoChecks] = useState<SEOCheck[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    analyzeSEO();
  }, [title, content, excerpt, seo]);

  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const getWordCount = (text: string): number => {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  const analyzeSEO = () => {
    const checks: SEOCheck[] = [];
    let totalScore = 0;
    const maxScore = 100;

    // Calculate basic metrics
    const contentWordCount = getWordCount(content);
    const contentReadingTime = calculateReadingTime(content);
    setWordCount(contentWordCount);
    setReadingTime(contentReadingTime);

    // Title checks
    const seoTitle = seo.title || title;
    if (seoTitle.length === 0) {
      checks.push({
        name: 'SEO Title',
        status: 'error',
        message: 'SEO title is missing',
        score: 0
      });
    } else if (seoTitle.length < 30) {
      checks.push({
        name: 'SEO Title',
        status: 'warning',
        message: `SEO title is too short (${seoTitle.length} chars). Aim for 30-60 characters.`,
        score: 5
      });
      totalScore += 5;
    } else if (seoTitle.length > 60) {
      checks.push({
        name: 'SEO Title',
        status: 'warning',
        message: `SEO title is too long (${seoTitle.length} chars). Keep it under 60 characters.`,
        score: 8
      });
      totalScore += 8;
    } else {
      checks.push({
        name: 'SEO Title',
        status: 'good',
        message: `SEO title length is optimal (${seoTitle.length} chars)`,
        score: 15
      });
      totalScore += 15;
    }

    // Meta description checks
    const metaDescription = seo.description || excerpt;
    if (metaDescription.length === 0) {
      checks.push({
        name: 'Meta Description',
        status: 'error',
        message: 'Meta description is missing',
        score: 0
      });
    } else if (metaDescription.length < 120) {
      checks.push({
        name: 'Meta Description',
        status: 'warning',
        message: `Meta description is too short (${metaDescription.length} chars). Aim for 120-160 characters.`,
        score: 5
      });
      totalScore += 5;
    } else if (metaDescription.length > 160) {
      checks.push({
        name: 'Meta Description',
        status: 'warning',
        message: `Meta description is too long (${metaDescription.length} chars). Keep it under 160 characters.`,
        score: 8
      });
      totalScore += 8;
    } else {
      checks.push({
        name: 'Meta Description',
        status: 'good',
        message: `Meta description length is optimal (${metaDescription.length} chars)`,
        score: 15
      });
      totalScore += 15;
    }

    // Content length checks
    if (contentWordCount < 300) {
      checks.push({
        name: 'Content Length',
        status: 'warning',
        message: `Content is too short (${contentWordCount} words). Aim for at least 300 words.`,
        score: 5
      });
      totalScore += 5;
    } else if (contentWordCount >= 300 && contentWordCount < 1000) {
      checks.push({
        name: 'Content Length',
        status: 'good',
        message: `Content length is good (${contentWordCount} words)`,
        score: 10
      });
      totalScore += 10;
    } else {
      checks.push({
        name: 'Content Length',
        status: 'good',
        message: `Content length is excellent (${contentWordCount} words)`,
        score: 15
      });
      totalScore += 15;
    }

    // Focus keyword checks
    if (seo.focusKeyword) {
      const keyword = seo.focusKeyword.toLowerCase();
      const titleContainsKeyword = seoTitle.toLowerCase().includes(keyword);
      const contentContainsKeyword = content.toLowerCase().includes(keyword);
      const descriptionContainsKeyword = metaDescription.toLowerCase().includes(keyword);

      if (titleContainsKeyword && contentContainsKeyword && descriptionContainsKeyword) {
        checks.push({
          name: 'Focus Keyword',
          status: 'good',
          message: `Focus keyword "${seo.focusKeyword}" is well optimized`,
          score: 20
        });
        totalScore += 20;
      } else if (titleContainsKeyword || contentContainsKeyword) {
        checks.push({
          name: 'Focus Keyword',
          status: 'warning',
          message: `Focus keyword "${seo.focusKeyword}" could be better optimized`,
          score: 10
        });
        totalScore += 10;
      } else {
        checks.push({
          name: 'Focus Keyword',
          status: 'error',
          message: `Focus keyword "${seo.focusKeyword}" not found in title or content`,
          score: 0
        });
      }
    } else {
      checks.push({
        name: 'Focus Keyword',
        status: 'warning',
        message: 'No focus keyword set',
        score: 0
      });
    }

    // Headings check (basic HTML heading detection)
    const headingMatches = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi);
    if (!headingMatches || headingMatches.length === 0) {
      checks.push({
        name: 'Headings Structure',
        status: 'warning',
        message: 'No headings found. Use H1-H6 tags to structure your content.',
        score: 0
      });
    } else {
      checks.push({
        name: 'Headings Structure',
        status: 'good',
        message: `${headingMatches.length} headings found`,
        score: 10
      });
      totalScore += 10;
    }

    // Keywords density check
    if (seo.keywords && seo.keywords.length > 0) {
      checks.push({
        name: 'Keywords',
        status: 'good',
        message: `${seo.keywords.length} keywords defined`,
        score: 10
      });
      totalScore += 10;
    } else {
      checks.push({
        name: 'Keywords',
        status: 'warning',
        message: 'No keywords defined',
        score: 0
      });
    }

    // Reading time check
    if (contentReadingTime >= 2 && contentReadingTime <= 10) {
      checks.push({
        name: 'Reading Time',
        status: 'good',
        message: `Optimal reading time (${contentReadingTime} min)`,
        score: 5
      });
      totalScore += 5;
    } else if (contentReadingTime > 10) {
      checks.push({
        name: 'Reading Time',
        status: 'warning',
        message: `Long reading time (${contentReadingTime} min). Consider breaking into parts.`,
        score: 3
      });
      totalScore += 3;
    } else {
      checks.push({
        name: 'Reading Time',
        status: 'warning',
        message: `Short reading time (${contentReadingTime} min)`,
        score: 2
      });
      totalScore += 2;
    }

    setSeoChecks(checks);
    setOverallScore(totalScore);
    
    if (onScoreUpdate) {
      onScoreUpdate(totalScore);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          SEO Analysis
        </h3>
        <div className={`px-4 py-2 rounded-lg border-2 ${getScoreBackground(overallScore)}`}>
          <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}/100
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center text-slate-600 dark:text-slate-400">
            <Eye className="w-4 h-4 mr-2" />
            <span className="text-sm">Word Count</span>
          </div>
          <p className="text-xl font-semibold text-slate-800 dark:text-slate-200">
            {wordCount}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">Reading Time</span>
          </div>
          <p className="text-xl font-semibold text-slate-800 dark:text-slate-200">
            {readingTime} min
          </p>
        </div>
      </div>

      {/* SEO Checks */}
      <div className="space-y-3">
        {seoChecks.map((check, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
          >
            {getStatusIcon(check.status)}
            <div className="flex-1">
              <h4 className="font-medium text-slate-800 dark:text-slate-200">
                {check.name}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {check.message}
              </p>
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {check.score}pts
            </span>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          SEO Recommendations
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          {overallScore < 80 && (
            <>
              <li>• Optimize your title and meta description lengths</li>
              <li>• Add a focus keyword and use it strategically</li>
              <li>• Structure your content with proper headings (H1-H6)</li>
              <li>• Ensure content is comprehensive (300+ words)</li>
            </>
          )}
          {overallScore >= 80 && (
            <li>• Great job! Your content is well optimized for SEO</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SEOAnalyzer;

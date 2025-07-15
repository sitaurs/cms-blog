import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  views: number;
  likes: number;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    focusKeyword?: string;
    readabilityScore?: number;
    seoScore?: number;
  };
  analytics: {
    views: number;
    uniqueViews: number;
    shares: number;
    comments: number;
    avgReadTime?: number;
    bounceRate?: number;
    lastViewedAt?: Date;
  };
  monetization: {
    isPremium: boolean;
    hasAds: boolean;
    affiliateLinks: string[];
    sponsoredContent: boolean;
  };
  readTime: number;
  structuredData?: any;
  isFeature: boolean;
  allowComments: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  content: {
    type: String,
    required: true
  },
  featuredImage: {
    type: String,
    default: ''
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  seo: {
    title: {
      type: String,
      maxlength: 60
    },
    description: {
      type: String,
      maxlength: 160
    },
    keywords: [{
      type: String,
      trim: true
    }],
    canonicalUrl: String,
    ogTitle: {
      type: String,
      maxlength: 60
    },
    ogDescription: {
      type: String,
      maxlength: 160
    },
    ogImage: String,
    twitterTitle: {
      type: String,
      maxlength: 60
    },
    twitterDescription: {
      type: String,
      maxlength: 160
    },
    twitterImage: String,
    focusKeyword: String,
    readabilityScore: {
      type: Number,
      min: 0,
      max: 100
    },
    seoScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    uniqueViews: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    avgReadTime: Number,
    bounceRate: Number,
    lastViewedAt: Date
  },
  monetization: {
    isPremium: {
      type: Boolean,
      default: false
    },
    hasAds: {
      type: Boolean,
      default: true
    },
    affiliateLinks: [String],
    sponsoredContent: {
      type: Boolean,
      default: false
    }
  },
  readTime: {
    type: Number,
    default: 0
  },
  structuredData: Schema.Types.Mixed,
  isFeature: {
    type: Boolean,
    default: false
  },
  allowComments: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

postSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ category: 1, publishedAt: -1 });
postSchema.index({ tags: 1, publishedAt: -1 });

export default mongoose.model<IPost>('Post', postSchema);
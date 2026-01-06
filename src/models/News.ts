import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INews extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  featuredImage?: string;
  images?: string[];
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Başlık gereklidir'],
    trim: true,
    maxlength: [200, 'Başlık 200 karakterden uzun olamaz'],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'İçerik gereklidir'],
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Özet 500 karakterden uzun olamaz'],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Kategori gereklidir'],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Yazar gereklidir'],
  },
  featuredImage: {
    type: String,
  },
  images: [{
    type: String,
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  publishedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Yayınlanma tarihini otomatik ayarla
NewsSchema.pre('save', function(next) {
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

const News: Model<INews> = mongoose.models.News || mongoose.model<INews>('News', NewsSchema);

export default News;
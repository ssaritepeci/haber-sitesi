import mongoose, { Schema, Document } from 'mongoose'

export interface IComment extends Document {
  news: mongoose.Types.ObjectId
  author: string
  email: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
}

const CommentSchema: Schema = new Schema({
  news: {
    type: Schema.Types.ObjectId,
    ref: 'News',
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
})

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)

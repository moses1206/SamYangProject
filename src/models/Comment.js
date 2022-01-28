// ES6문법으로 변경

import mongoose from 'mongoose'

const CommentSchema = mongoose.Schema(
  {
    content: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
      index: true,
    },
    storeName: { type: String, required: true },
    promotion: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'promotion',
    },
  },
  { timestamps: true }
)

CommentSchema.index({ promotion: 1, createdAt: -1 })

const Comment = mongoose.model('comment', CommentSchema)

export { Comment, CommentSchema }

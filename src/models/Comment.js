// ES6문법으로 변경

import mongoose from 'mongoose'

const CommentSchema = mongoose.Schema(
  {
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    promotion: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'promotion',
    },
  },
  { timestamps: true }
)

const Comment = mongoose.model('comment', CommentSchema)

export default Comment

import mongoose from 'mongoose'
import { CommentSchema } from './Comment.js'

const PromotionSchema = mongoose.Schema(
  {
    superMarketName: { type: String, required: true },
    address: { type: String, required: true },
    pos: { type: Number },
    image: [{ type: String }],
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    promotionType: { type: String, required: true },
    promotionCost: { type: Number, required: true },
    promotionDetail: [
      {
        productName: { type: String },
        price: { type: Number },
        promotionValue: { type: Number },
        prValue: { type: Number },
      },
    ],
    islive: { type: Boolean, required: true, default: false },

    // 프로모션에 유저정보 선택저장.
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
      },
      channel: { type: String, required: true },
      storeName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      address: {
        warehouse: { type: String, required: true },
        lat: { type: String },
        lng: { type: String },
      },
    },
    // 프로모션에 달린 후기의 숫자를 내장 (pagenation에 필요)
    commentsCount: { type: Number, default: 0, required: true },
    comments: [CommentSchema],
  },
  { timestamps: true }
)

// Index 복합키 설정 (내림차순 정렬)
PromotionSchema.index({ 'user._id': 1, updatedAt: 1 })

// Text인덱스는 컬렉션당 1개만 만들 수 있다.
// 단어가 정확해야 한다.
PromotionSchema.index({ superMarketName: 'text', productName: 'text' })

// PromotionSchema.virtual('comments', {
//   // comment Database에서 로컬필드의 _id와 코멘트 스키마에 있는 promotion아이디가
//   // 같은 것을 가져와라.
//   ref: 'comment',
//   localField: '_id',
//   foreignField: 'promotion',
// })

// PromotionSchema.set('toObject', { virtuals: true })
// PromotionSchema.set('toJSON', { virtuals: true })

const Promotion = mongoose.model('promotion', PromotionSchema)

export { Promotion, PromotionSchema }

import mongoose from 'mongoose'

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
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  },
  { timestamps: true }
)

const Promotion = mongoose.model('promotion', PromotionSchema)

export default Promotion

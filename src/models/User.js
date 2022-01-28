import mongoose from 'mongoose'

const UserSchema = mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    channel: { type: String, required: true },
    storeName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    userImage: { type: String, required: true },
    address: {
      warehouse: { type: String, required: true },
      lat: { type: String },
      lng: { type: String },
    },
  },
  // 언제 생성되고 언제 업데이트가 되었는지
  { timestamps: true }
)

const User = mongoose.model('user', UserSchema)

export { User, UserSchema }

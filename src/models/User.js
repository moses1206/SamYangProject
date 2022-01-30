import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    channel: { type: String, required: true },
    userName: { type: String, required: true },
    storeName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    userImage: { type: String, required: true },
    address: {
      warehouse: { type: String, required: true },
      lat: { type: String },
      lng: { type: String },
    },
    // role : dealer , salesperson , admin
    role: { type: String, required: true, default: 'dealer' },
  },
  // 언제 생성되고 언제 업데이트가 되었는지
  { timestamps: true }
)

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('user', UserSchema)

export { User, UserSchema }

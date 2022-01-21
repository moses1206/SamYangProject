import express from 'express'
const app = express()
import promotionRouter from './routes/promotionRoute.js'
import userRouter from './routes/userRoute.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

import colors from 'colors'

const server = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB Connected'.rainbow)
    // Body Data 읽기
    app.use(express.json())

    app.use('/user', userRouter)
    app.use('/promotion', promotionRouter)

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () =>
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${5000}`.rainbow
      )
    )
  } catch (err) {
    console.log(err)
  }
}

server()

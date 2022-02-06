import express from 'express'
const app = express()
import promotionRouter from './routes/promotionRoute.js'
import userRouter from './routes/userRoute.js'
import commentRouter from './routes/commentRoute.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import generateFakeData from '../faker2.js'

dotenv.config()

import colors from 'colors'

const server = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI
    await mongoose.connect(MONGO_URI)

    // mongoose.set('debug', true)

    console.log('MongoDB Connected'.rainbow)
    // Body Data 읽기
    app.use(express.json())

    app.use('/api/user', userRouter)
    app.use('/api/promotion', promotionRouter)
    app.use('/api/promotion/:promotionId/comment', commentRouter)

    const PORT = process.env.PORT || 5000
    app.listen(PORT, async () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${5000}`.rainbow
      )
      // console.time('insert time: ')
      // for (let i = 0; i < 20; i++) {
      // await generateFakeData(10, 10, 10)
      // console.timeEnd('insert time: ')
      // }
    })
  } catch (err) {
    console.log(err)
  }
}

server()

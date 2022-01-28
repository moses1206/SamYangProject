import express from 'express'
import mongoose from 'mongoose'
import { Router } from 'express'
const userRouter = Router()
import { User } from '../models/User.js'
import { Promotion } from '../models/Promotion.js'
import { Comment } from '../models/Comment.js'

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({})
    return res.send({ users })
  } catch (err) {
    console.log(err)
  }
})

userRouter.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: 'invalid UserId' })

    const user = await User.findOne({ _id: userId })
    return res.send({ user })
  } catch (err) {
    console.log(err)
    return res.send({ err: err.message })
  }
})

userRouter.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    if (!mongoose.isValidObjectId(userId))
      res.status(400).send({ err: 'invalid userId' })

    const { channel, storeName, address, phoneNumber, userImage } = req.body

    // type Validation
    if (!channel && !storeName && !address && !phoneNumber && !userImage)
      return res.send({
        err: 'channel or storeName or address or phoneNumber or userImage is required !!',
      })

    if (channel && typeof channel !== 'string')
      return res.status(400).send({ err: 'channel must be String' })
    if (storeName && typeof storeName !== 'string')
      return res.status(400).send({ err: 'storeName must be String' })
    if (address && typeof address !== 'object')
      return res.status(400).send({ err: 'address must be Object' })
    if (phoneNumber && typeof phoneNumber !== 'string')
      return res.status(400).send({ err: 'phoneNumber must be String' })
    if (userImage && typeof userImage !== 'string')
      return res.status(400).send({ err: 'userImage must be String' })

    // // Create UpdateBody
    // let updateBody = {}
    // if (channel) updateBody.channel = channel
    // if (storeName) updateBody.storeName = storeName
    // if (address) updateBody.address = address
    // if (phoneNumber) updateBody.phoneNumber = phoneNumber
    // if (userImage) updateBody.userImage = userImage

    // const user = await User.findByIdAndUpdate(
    //   // Update id
    //   userid,
    //   // Update Object
    //   updateBody,
    //   // Return Updated value
    //   { new: true }
    // )

    let user = await User.findById(userId)
    if (channel) {
      user.channel = channel
      await Promotion.updateMany(
        { 'user._id': userId },
        { 'user.channel': channel }
      )
    }
    if (storeName) {
      user.storeName = storeName
      await Promise.all([
        Promotion.updateMany(
          { 'user._id': userId },
          { 'user.storeName': storeName }
        ),
        Promotion.updateMany(
          {},
          { 'comments.$[comment].storeName': `${storeName}` },
          { arrayFilters: [{ 'comment.user': userId }] }
        ),
      ])
    }
    if (phoneNumber) {
      user.phoneNumber = phoneNumber
      await Promotion.updateMany(
        { 'user._id': userId },
        { 'user.phoneNumber': phoneNumber }
      )
    }

    if (address) {
      user.address = address
      await Promotion.updateMany(
        { 'user._id': userId },
        { 'user.address': address }
      )
    }

    if (userImage) user.userImage = userImage

    await user.save()
    return res.send({ user })
  } catch (err) {
    console.log(err)
    return res.send({ err: err.message })
  }
})

userRouter.post('/register', async (req, res) => {
  try {
    let {
      userId,
      password,
      channel,
      storeName,
      phoneNumber,
      userImage,
      address,
    } = req.body

    if (!userId) return res.status(400).send({ err: 'userId is required' })
    if (!password) return res.status(400).send({ err: 'password is required' })
    if (!channel) return res.status(400).send({ err: 'channel is required' })
    if (!storeName)
      return res.status(400).send({ err: 'storeName is required' })
    if (!phoneNumber)
      return res.status(400).send({ err: 'phoneNumber is required' })
    if (!userImage)
      return res.status(400).send({ err: 'userImage is required' })
    if (!address) return res.status(400).send({ err: 'address is required' })

    const user = new User(req.body)
    user.save()
    return res.send({ user })
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: err.message })
  }
})

userRouter.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    if (!mongoose.isValidObjectId(userId))
      res.status(400).send({ err: 'invalid userId' })
    const [user] = await Promise.all([
      // 유저 삭제
      User.findOneAndDelete({ _id: userId }),
      // 유저가 작성한 프로모션 삭제
      Promotion.deleteMany({ 'user._id': userId }),
      // 프로모션모델에서 유저가 작성한 코멘트 삭제
      Promotion.updateMany(
        { 'comments.user': userId },
        { $pull: { comments: { user: userId } } }
      ),
      // 코멘트모델에서 유저가 작성한 코멘트 삭제
      Comment.deleteMany({ user: userId }),
    ])

    return res.send({ user })
  } catch (err) {
    console.log(err)
    return res.send({ err: err.message })
  }
})

export default userRouter

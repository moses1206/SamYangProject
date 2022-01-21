import express from 'express'
import mongoose from 'mongoose'
import { Router } from 'express'
const userRouter = Router()
import User from '../models/User.js'

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({})
    return res.send({ users })
  } catch (err) {
    console.log(err)
  }
})

userRouter.get('/:userid', async (req, res) => {
  try {
    const { userid } = req.params

    if (!mongoose.isValidObjectId(userid))
      return res.status(400).send({ err: 'invalid UserId' })

    const user = await User.findOne({ _id: userid })
    return res.send({ user })
  } catch (err) {
    console.log(err)
    return res.send({ err: err.message })
  }
})

userRouter.delete('/:userid', async (req, res) => {
  try {
    const { userid } = req.params
    if (!mongoose.isValidObjectId(userid))
      res.status(400).send({ err: 'invalid userid' })
    const user = await User.findOneAndDelete({ _id: userid })

    return res.send({ user })
  } catch (err) {
    console.log(err)
    return res.send({ err: err.message })
  }
})

userRouter.put('/:userid', async (req, res) => {
  try {
    const { userid } = req.params
    if (!mongoose.isValidObjectId(userid))
      res.status(400).send({ err: 'invalid userid' })

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

    let user = await User.findById(userid)
    if (channel) user.channel = channel
    if (storeName) user.storeName = storeName
    if (address) user.address = address
    if (phoneNumber) user.phoneNumber = phoneNumber
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
      userid,
      password,
      channel,
      storeName,
      phoneNumber,
      userImage,
      address,
    } = req.body

    if (!userid) return res.status(400).send({ err: 'userid is required' })
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

export default userRouter

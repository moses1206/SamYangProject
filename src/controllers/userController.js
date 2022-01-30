import mongoose from 'mongoose'
import expressAsyncHandler from 'express-async-handler'
import { User } from '../models/User.js'
import { Promotion } from '../models/Promotion.js'
import generateToken from '../utils/generateToken.js'

// @desc    Auth user & get token
// @route   POST   /api/user/login
// @access  Private
const authUser = expressAsyncHandler(async (req, res) => {
  const { userId, password } = req.body

  const user = await User.findOne({ userId })
  console.log(user)

  if (user && (await user.matchPassword(password))) {
    return res.json({
      _id: user._id,
      channel: user.channel,
      userName: user.userName,
      storeName: user.storeName,
      role: user.role,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid userId or password')
  }
})

// @desc    Register a new user
// @route   POST /api/user
// @access  Public
const registerUser = expressAsyncHandler(async (req, res) => {
  const {
    userId,
    password,
    channel,
    userName,
    storeName,
    phoneNumber,
    userImage,
    address,
    role,
  } = req.body

  if (!userId) return res.status(400).send({ err: 'userId is required' })
  if (!password) return res.status(400).send({ err: 'password is required' })
  if (!channel) return res.status(400).send({ err: 'channel is required' })
  if (!userName) return res.status(400).send({ err: 'userName is required' })
  if (!storeName) return res.status(400).send({ err: 'storeName is required' })
  if (!phoneNumber)
    return res.status(400).send({ err: 'phoneNumber is required' })
  if (!userImage) return res.status(400).send({ err: 'userImage is required' })
  if (!address) return res.status(400).send({ err: 'address is required' })

  const userExists = await User.findOne({ userId })

  if (userExists) {
    return res.status(400).send({ err: 'User already exists' })
  }

  const user = await User.create({
    userId,
    password,
    channel,
    userName,
    storeName,
    phoneNumber,
    userImage,
    address,
    role,
  })

  if (user) {
    res.status(201).json({
      userId: user.userId,
      channel: user.channel,
      userName: user.userName,
      storeName: user.storeName,
      phoneNumber: user.phoneNumber,
      userImage: user.userImage,
      address: user.address,
      role: user.role,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Get Users
// @route   GET   /api/user
// @access  Private
const getUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find({})
  return res.send({ users })
})

// @desc    Get single User
// @route   GET   /api/user/:id
// @access  Private
const getUser = expressAsyncHandler(async (req, res) => {
  const { userId } = req.params

  if (!mongoose.isValidObjectId(userId))
    return res.status(400).send({ err: 'invalid params userId' })

  const user = await User.findOne({ _id: userId })
  return res.send({ user })
})

// @desc    Put single User
// @route   PUT   /api/user/:id
// @access  Private
const updateUser = expressAsyncHandler(async (req, res) => {
  const { userId } = req.params
  if (!mongoose.isValidObjectId(userId))
    res.status(400).send({ err: 'invalid params userId' })

  const {
    channel,
    userName,
    storeName,
    address,
    phoneNumber,
    userImage,
    role,
  } = req.body

  // type Validation
  if (
    !channel &&
    !userName &&
    !storeName &&
    !address &&
    !phoneNumber &&
    !userImage &&
    !role
  )
    return res.send({
      err: 'channel or userName or storeName or address or phoneNumber or userImage or role is required !!',
    })

  if (channel && typeof channel !== 'string')
    return res.status(400).send({ err: 'channel must be String' })
  if (userName && typeof userName !== 'string')
    return res.status(400).send({ err: 'userName must be String' })
  if (storeName && typeof storeName !== 'string')
    return res.status(400).send({ err: 'storeName must be String' })
  if (address && typeof address !== 'object')
    return res.status(400).send({ err: 'address must be Object' })
  if (phoneNumber && typeof phoneNumber !== 'string')
    return res.status(400).send({ err: 'phoneNumber must be String' })
  if (userImage && typeof userImage !== 'string')
    return res.status(400).send({ err: 'userImage must be String' })
  if (role && typeof role !== 'string')
    return res.status(400).send({ err: 'role must be String' })

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

  if (userName) user.userName = userName

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

  if (role) user.role = role

  await user.save()
  return res.send({ user })
})

// @desc    Delete a User
// @route   DELETE   /api/user/:userId
// @access  Private
const deleteUser = expressAsyncHandler(async (req, res) => {
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
})

export { authUser, registerUser, getUsers, getUser, updateUser, deleteUser }

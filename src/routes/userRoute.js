import express from 'express'
import mongoose from 'mongoose'
import { Router } from 'express'
const userRouter = Router()
import { User } from '../models/User.js'
import { Promotion } from '../models/Promotion.js'
import { Comment } from '../models/Comment.js'
import {
  authUser,
  registerUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js'

userRouter.delete('/:userId', async (req, res) => {
  try {
  } catch (err) {
    console.log(err)
    return res.send({ err: err.message })
  }
})

userRouter.route('/login').post(authUser)
userRouter.route('/register').post(registerUser)
userRouter.route('/').get(getUsers)
userRouter.route('/:userId').get(getUser)
userRouter.route('/:userId').put(updateUser)
userRouter.route('/:userId').delete(deleteUser)

export default userRouter

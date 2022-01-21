import { Router } from 'express'
const commentRouter = Router({ mergeParams: true })
import Promotion from '../models/Promotion.js'
import Comment from '../models/Comment.js'
import User from '../models/User.js'
import mongoose from 'mongoose'

const { isValidObjectId } = mongoose

commentRouter.post('/', async (req, res) => {
  try {
    const { promotionid } = req.params
    const { content, userid } = req.body

    if (!isValidObjectId(promotionid))
      return res.status(400).send({ err: 'Promotionid is inValid' })

    if (!isValidObjectId(userid))
      return res.status(400).send({ err: 'Userid is inValid' })

    if (typeof content !== 'string')
      return res.status(400).send({ err: 'Content is required !!' })

    // Promise all 을 사용하여 동기작업 실행 - 성능향상
    const [promotion, user] = await Promise.all([
      Promotion.findById(promotionid),
      User.findById(userid),
    ])

    // 비동기 실행 - 성능저하 유발
    // const promotion = await Promotion.findById(promotionid)
    // const user = await User.findById(userid)

    if (!promotion || !user)
      return res.status(400).send({ err: 'promotion or user does not exist' })

    if (!promotion.islive)
      return res.status(400).send({ err: 'promotion is not available !!' })

    const comment = new Comment({ content, user, promotion })
    await comment.save()
    return res.send({ comment })
  } catch (err) {
    return res.status(400).send({ err: err.messsage })
  }
})

commentRouter.get('/', async (req, res) => {
  const { promotionid } = req.params
  if (!isValidObjectId(promotionid))
    return res.status(400).send({ err: 'Promotionid is inValid' })

  const comments = await Comment.find({ promotion: promotionid })
  return res.send({ comments })
})

commentRouter.delete('/:commentid', async (req, res) => {})

export default commentRouter

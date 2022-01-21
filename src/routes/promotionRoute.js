import { Router } from 'express'
const promotionRouter = Router()
import mongoose from 'mongoose'
import Promotion from '../models/Promotion.js'
import User from '../models/User.js'
import commentRouter from './CommentRoute.js'

const { ObjectId } = mongoose.Types

promotionRouter.use('/promotion/:promotionid/comment', commentRouter)

promotionRouter.post('/', async (req, res) => {
  try {
    const {
      superMarketName,
      address,
      pos,
      image,
      start_date,
      end_date,
      promotionType,
      promotionCost,
      promotionDetail,
      islive,
      userid,
    } = req.body

    // Promotion Validation
    if (superMarketName && typeof superMarketName !== 'string')
      return res.status(400).send({ err: 'superMarketName must be String' })
    if (address && typeof address !== 'string')
      return res.status(400).send({ err: 'address must be String' })
    if (pos && typeof pos !== 'number')
      return res.status(400).send({ err: 'pos must be Number' })
    if (address && typeof address !== 'string')
      return res.status(400).send({ err: 'address must be String' })
    if (image && typeof image !== 'string')
      return res.status(400).send({ err: 'image must be String' })
    if (start_date && typeof start_date !== 'string')
      return res.status(400).send({ err: 'start_date must be string' })
    if (end_date && typeof end_date !== 'string')
      return res.status(400).send({ err: 'end_date must be String' })
    if (promotionType && typeof promotionType !== 'string')
      return res.status(400).send({ err: 'promotionType must be String' })
    if (promotionCost && typeof promotionCost !== 'number')
      return res.status(400).send({ err: 'promotionCost must be Number' })
    // Promotion Detail Validation
    if (promotionDetail && typeof promotionDetail !== 'object')
      return res.status(400).send({ err: 'promotionDetail must be Object' })

    if (islive && typeof islive !== 'boolean')
      return res.status(400).send({ err: 'islive must be Boolean' })

    // User Validation
    if (!ObjectId.isValid(userid))
      return res.status(400).send({ err: 'userid is invalid ' })

    let user = await User.findById(userid)
    if (!user) return res.status(400).send({ err: 'user does not exist !!' })

    let promotion = new Promotion({
      ...req.body,
      user,
    })

    await promotion.save()
    return res.send({ promotion })
  } catch (err) {
    console.log(err)
    res.send(500).send({ err: err.message })
  }
})

promotionRouter.get('/', async (req, res) => {
  try {
    const promotions = await Promotion.find({})
    return res.send({ promotions })
  } catch (err) {
    console.log(err)
    res.send(500).send({ err: err.message })
  }
})

promotionRouter.get('/:promotionid', async (req, res) => {
  try {
    const { promotionid } = req.params
    if (!ObjectId.isValid(promotionid))
      return res.status(400).send({ err: 'invalid Promotionid' })
    const promotion = await Promotion.findOne({ _id: promotionid })
    return res.send({ promotion })
  } catch (err) {
    console.log(err)
    res.send(500).send({ err: err.message })
  }
})

promotionRouter.put('/:promotionid', async (req, res) => {
  try {
    const { promotionid } = req.params
    const {
      superMarketName,
      address,
      pos,
      image,
      start_date,
      end_date,
      promotionType,
      promotionCost,
      promotionDetail,
    } = req.body

    if (
      !superMarketName &&
      !address &&
      !pos &&
      !image &&
      !start_date &&
      !end_date &&
      !promotionType &&
      !promotionCost &&
      !promotionDetail
    )
      return res.send({ err: 'At least one value is required !!' })

    let promotion = await Promotion.findById(promotionid)

    if (superMarketName) promotion.superMarketName = superMarketName
    if (address) promotion.address = address
    if (pos) promotion.pos = pos
    if (image) promotion.image = image
    if (start_date) promotion.start_date = start_date
    if (end_date) promotion.end_date = end_date
    if (promotionType) promotion.promotionType = promotionType
    if (promotionCost) promotion.promotionCost = promotionCost
    if (promotionDetail) promotion.promotionDetail = promotionDetail

    await promotion.save()

    return res.send({ promotion })
  } catch (err) {
    console.log(err)
    res.send(500).send({ err: err.message })
  }
})

// put 전체 수정 , patch 는 부분 수정
promotionRouter.patch('/:promotionid/live', async (req, res) => {
  try {
    const { promotionid } = req.params
    if (!ObjectId.isValid(promotionid))
      return res.status(400).send({ err: 'invalid Promotionid' })
    const { islive } = req.body
    if (typeof islive !== 'boolean')
      res.status(400).send({ err: 'boolean islive is required' })

    const promotion = await Promotion.findByIdAndUpdate(
      promotionid,
      { islive },
      { new: true }
    )
    res.send({ promotion })
  } catch (err) {
    console.log(err)
    res.send(500).send({ err: err.message })
  }
})

promotionRouter.delete('/:promotionid/live', async (req, res) => {
  try {
    const { promotionid } = req.params
    if (!ObjectId.isValid(promotionid))
      res.status(400).send({ err: 'invalid promotionid' })
    const promotion = await Promotion.findOneAndDelete({ _id: promotionid })

    return res.send({ promotion })
  } catch (err) {
    console.log(err)
    res.send(500).send({ err: err.message })
  }
})

export default promotionRouter

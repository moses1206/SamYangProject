import mongoose from 'mongoose'
import expressAsyncHandler from 'express-async-handler'
import { Promotion } from '../models/Promotion.js'
import { User } from '../models/User.js'
const { ObjectId } = mongoose.Types

// @desc    Fetch all promotions
// @route   Get   /api/promotion
// @access  Private
const getPromotions = expressAsyncHandler(async (req, res) => {
  // page가 없으면 0으로 처리
  let { page = 0 } = req.query
  page = parseInt(page)

  console.log('page :', page)
  const promotions = await Promotion.find({})
    // UpdatedAt 최근순으로
    .sort({ updatedAt: -1 })
    // 스킵숫자
    .skip(page * 3)
    // 프론트로 보내줄 숫자
    .limit(3)
  // .populate([
  //   { path: 'user' },
  //   { path: 'comments', populate: { path: 'user' } },
  // ])

  return res.send({ promotions })
})

// @desc    Fetch single promotion
// @route   Get   /api/promotion/:promotionId
// @access  Private
const getPromotionById = expressAsyncHandler(async (req, res) => {
  const { promotionId } = req.params
  if (!ObjectId.isValid(promotionId))
    return res.status(400).send({ err: 'invalid promotionId' })

  const promotion = await Promotion.findOne({ _id: promotionId })

  // 페이지가 몇개인지 확인
  // const commentCount = await Comment.find({
  //   promotion: promotionId,
  // }).countDocuments()

  return res.send({ promotion })
})

// @desc    Fetch single promotion
// @route   Get   /api/promotion/:promotionId
// @access  Private
const createPromotion = expressAsyncHandler(async (req, res) => {
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
    userId,
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
  if (!ObjectId.isValid(userId))
    return res.status(400).send({ err: 'userId is invalid ' })

  let user = await User.findById(userId)
  if (!user) return res.status(400).send({ err: 'user does not exist !!' })

  let promotion = new Promotion({
    ...req.body,
    user,
  })

  await promotion.save()
  return res.send({ promotion })
})

// @desc    Modify a promotion
// @route   Put   /api/promotion/:promotionId
// @access  Private
const updatePromotionById = expressAsyncHandler(async (req, res) => {
  const { promotionId } = req.params
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

  let promotion = await Promotion.findById(promotionId)

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
})

// @desc    Patch a promotion
// @route   patch   /api/promotion/:promotionId/live
// @access  Private
const patchPromotionById = expressAsyncHandler(async (req, res) => {
  const { promotionId } = req.params
  if (!ObjectId.isValid(promotionId))
    return res.status(400).send({ err: 'invalid promotionId' })
  const { islive } = req.body
  if (typeof islive !== 'boolean')
    res.status(400).send({ err: 'boolean islive is required' })

  const promotion = await Promotion.findByIdAndUpdate(
    promotionId,
    { islive },
    { new: true }
  )
  res.send({ promotion })
})

// @desc    Delete a promotion
// @route   delete   /api/promotion/:promotionId
// @access  Private
const deletePromotionById = expressAsyncHandler(async (req, res) => {
  const { promotionId } = req.params
  if (!ObjectId.isValid(promotionId))
    res.status(400).send({ err: 'invalid promotionId' })
  const promotion = await Promotion.findOneAndDelete({ _id: promotionId })

  return res.send({ promotion })
})

export {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotionById,
  patchPromotionById,
  deletePromotionById,
}

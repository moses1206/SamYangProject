import { Router } from 'express'
const commentRouter = Router({ mergeParams: true })
import { Promotion } from '../models/Promotion.js'
import { Comment } from '../models/Comment.js'
import { User } from '../models/User.js'
import mongoose from 'mongoose'

const { isValidObjectId } = mongoose

commentRouter.post('/', async (req, res) => {
  try {
    const { promotionId } = req.params
    const { content, userId } = req.body

    if (!isValidObjectId(promotionId))
      return res.status(400).send({ err: 'Promotionid is inValid' })

    if (!isValidObjectId(userId))
      return res.status(400).send({ err: 'UserId is inValid' })

    if (typeof content !== 'string')
      return res.status(400).send({ err: 'Content is required !!' })

    // Promise all 을 사용하여 동기작업 실행 - 성능향상
    const [promotion, user] = await Promise.all([
      Promotion.findById(promotionId),
      User.findById(userId),
    ])

    // 비동기 실행 - 성능저하 유발
    // const promotion = await Promotion.findById(promotionid)
    // const user = await User.findById(userid)

    if (!promotion || !user)
      return res.status(400).send({ err: 'promotion or user does not exist' })

    if (!promotion.islive)
      return res.status(400).send({ err: 'promotion is not available !!' })

    const comment = new Comment({
      content,
      user,
      promotion: promotionId,
      storeName: `${user.storeName}`,
    })

    // Comment 데이터랑 Promotion의 Comment 데이터를 동시에 생성
    // await Promise.all([
    //   comment.save(),
    //   Promotion.updateOne(
    //     { _id: promotionId },
    //     { $push: { comments: comment } }
    //   ),
    // ])

    // ========최신 후기 3개만 내장하는 법 =========//

    // commentsCount++ 숫자 1증감
    promotion.commentsCount++

    // insert comment
    promotion.comments.push(comment)

    // shift는 배열의 앞을 지운다.  a=[1,2,3]   a.push(4)  ==>   a=[1,2,3,4] , a.shift()  ==>   a=[2,3,4]
    // 최신의 3개만 Nesting하여 성능도 가져가면서 보유 용량도 줄인다. 더보기 버튼을 통하여 pagenation을 진행시킨다.
    if (promotion.commentsCount > 3) promotion.comments.shift()

    // ========최신 후기 3개만 내장하는 법 =========//

    await Promise.all([
      comment.save(),
      promotion.save(),

      // $inc는 increment의 약자로 값의 증감을 나타내준다. 코멘트가 1개 생성될때마다 1개씩 증가
      // 프로모션스키마에 commentsCount를 내장
      // Promotion.updateOne({ _id: promotionId }, { $inc: { commentsCount: 1 } }),
    ])

    return res.send({ comment })
  } catch (err) {
    return res.status(400).send({ err: err.messsage })
  }
})

commentRouter.get('/', async (req, res) => {
  // page가 없을때 0으로 처리
  let { page = 0 } = req.query

  page = parseInt(page)

  console.log({ page })

  const { promotionId } = req.params
  if (!isValidObjectId(promotionId))
    return res.status(400).send({ err: 'promotionId is inValid' })

  const comments = await Comment.find({ promotion: promotionId })
    .sort({ createdAt: -1 })
    .skip(page * 3)
    .limit(3)
  return res.send({ comments })
})

commentRouter.patch('/:commentId', async (req, res) => {
  const { commentId } = req.params
  const { content } = req.body

  if (typeof content !== 'string')
    return res.status(400).send({ err: 'content is required !!' })

  const comment = await Promise.all([
    // 코멘트 데이터베이스를 바꾸고
    Comment.findOneAndUpdate({ _id: commentId }, { content }, { new: true }),

    // 프로모션에 Nesting된 코멘트를 바꾼다.
    Promotion.updateOne(
      // 몽고DB문법이다 자바스크립트 문법아님.
      // comments에 있는 _id 가 commentId와 같은 것을 찾고
      { 'comments._id': commentId },
      // 찾은 코멘트의 내용을 바꾸는 몽고DB문법이다.
      { 'comments.$.content': content }
    ),
  ])

  return res.send({ comment })
})

commentRouter.delete('/:commentId', async (req, res) => {
  const { commentId } = req.params
  const comment = await Comment.findByIdAndDelete({ _id: commentId })

  // push 는 배열에 추가 , pull 배열에서 삭제
  await Promotion.updateOne(
    { 'comments._id': commentId },
    // _id가 commentId인것을 삭제
    { $pull: { comments: { _id: commentId } } }

    // 예시 : content가 hello 이거나(or) state가 true 인 것 삭제
    // { $pull: { comments: { content: "hello", state : true } } }

    // 예시 : content가 hello 이면서(and) state가 true 인 것 삭제
    // { $pull: { comments: { $elemMatch:{ content: "hello", state : true } } } }
  )

  return res.send({ comment })
})

export default commentRouter

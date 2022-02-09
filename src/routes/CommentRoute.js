import { Router } from 'express'
const commentRouter = Router({ mergeParams: true })
import {
  createComment,
  getCommentById,
  patchCommentById,
  deleteCommentById,
} from '../controllers/commentController.js'

commentRouter.route('/').post(createComment)
commentRouter.route('/').get(getCommentById)
commentRouter.route('/:commentId').patch(patchCommentById)
commentRouter.route('/:commentId').delete(deleteCommentById)

export default commentRouter

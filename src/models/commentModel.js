import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const COMMENT_COLLECTION_NAME = 'comments'
const COMMENT_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  cardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  content: Joi.string().required().min(3).max(500).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const validateBeforeCreate = async (data) => {
  return await COMMENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  const db = await GET_DB()
  const validData = await validateBeforeCreate(data)
  const createComment = await db.collection(COMMENT_COLLECTION_NAME).insertOne(validData)
  return createComment
}

const getCommentsByCardId = async (cardId) => {
  const db = await GET_DB()
  const comments = await db.collection(COMMENT_COLLECTION_NAME).find({ cardId }).toArray()
  return comments
}

const updateById = async (commentId, data) => {
  const db = await GET_DB()
  const updateComment = await db.collection(COMMENT_COLLECTION_NAME).updateOne({ _id: new ObjectId(commentId) }, { $set: data })
  return updateComment
}

const deleteById = async (commentId) => {
  const db = await GET_DB()
  const deleteComment = await db.collection(COMMENT_COLLECTION_NAME).deleteOne({ _id: new ObjectId(commentId) })
  return deleteComment
}

export const commentModel = {
  COMMENT_COLLECTION_NAME,
  COMMENT_COLLECTION_SCHEMA,
  createNew,
  getCommentsByCardId,
  updateById,
  deleteById
}

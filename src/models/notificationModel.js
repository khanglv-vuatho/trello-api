import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const NOTIFICATION_COLLECTION_NAME = 'notifications'
const NOTIFICATION_COLLECTION_SCHEMA = Joi.object({
  ownerId: Joi.string().required().min(3).max(50).trim().strict().email(),
  authorId: Joi.string().required().min(3).max(50).trim().strict().email(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  status: Joi.string().valid('unread', 'read').default('unread').required(),
  type: Joi.string().valid('invite').required(),
  title: Joi.string().required().min(1).max(500).trim().strict(),
  invitation: Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    boardTitle: Joi.string().required().trim(),
    status: Joi.string().valid('pending', 'removed').default('pending').required()
  }).required()
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'updatedAt']

const validateBeforeCreate = async (data) => {
  return await NOTIFICATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  const db = await GET_DB()
  const result = await db.collection(NOTIFICATION_COLLECTION_NAME).insertOne(data)
  return result
}

const getAll = async (ownerId) => {
  const db = await GET_DB()
  const result = await db.collection(NOTIFICATION_COLLECTION_NAME).find({ ownerId }).sort({ createdAt: -1 }).toArray()
  return result || []
}

export const notificationModel = {
  NOTIFICATION_COLLECTION_NAME,
  NOTIFICATION_COLLECTION_SCHEMA,
  createNew,
  getAll
}

import { GET_DB } from '@/config/mongodb'
import { MESSAGE_TYPES } from '@/utils/constants'
import Joi from 'joi'
import { ObjectId } from 'mongodb'

const MESSAGE_COLLECTION_NAME = 'messages'
const MESSAGE_COLLECTION_SCHEMA = Joi.object({
  content: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(MESSAGE_TYPES))
    .default(MESSAGE_TYPES.TEXT),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const createNew = async (message) => {
  const db = await GET_DB()

  const result = await db.collection(MESSAGE_COLLECTION_NAME).insertOne(message)
  return result.insertedId
}

const getDetails = async (id) => {
  const db = await GET_DB()
  const message = await db.collection(MESSAGE_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  return message
}

const getAll = async (conversationId) => {
  const db = await GET_DB()
  const messages = await db.collection(MESSAGE_COLLECTION_NAME).find({ conversationId }).toArray()
  return messages
}

export const messageModel = {
  MESSAGE_COLLECTION_NAME,
  MESSAGE_COLLECTION_SCHEMA,
  createNew,
  getDetails,
  getAll
}

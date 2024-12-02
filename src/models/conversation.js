import { GET_DB } from '@/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'
import Joi from 'joi'

const CONVERSATION_COLLECTION_NAME = 'conversations'

// Reuse message schema from messageModel to avoid duplication
const CONVERSATION_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().trim().strict().required(),
  chatWithUserId: Joi.string().email().trim().strict().required(),
  messages: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const getAll = async (email) => {
  const db = await GET_DB()
  const conversations = await db
    .collection(CONVERSATION_COLLECTION_NAME)
    .find({
      $or: [{ email }, { chatWithUserId: email }]
    })
    .toArray()
  return conversations
}

const createNew = async (email, content, type, chatWithUserId) => {
  const db = await GET_DB()
  const result = await db.collection(CONVERSATION_COLLECTION_NAME).insertOne({ email, chatWithUserId, messages: [{ content, type }] })
  return result.insertedId
}

const validateBeforeCreate = async (data) => {
  return await CONVERSATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

export const conversationModel = {
  CONVERSATION_COLLECTION_NAME,
  CONVERSATION_COLLECTION_SCHEMA,
  validateBeforeCreate,
  getAll,
  createNew
}

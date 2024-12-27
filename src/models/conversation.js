import { GET_DB } from '@/config/mongodb'
import { MESSAGE_TYPES } from '@/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '@/utils/validators'
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { messageModel } from '@/models/message'

const CONVERSATION_COLLECTION_NAME = 'conversations'

// Reuse message schema from messageModel to avoid duplication
const CONVERSATION_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().trim().strict().required(),
  chatWithUserId: Joi.string().email().trim().strict().required(),
  messages: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  type: Joi.string()
    .valid(...Object.values(MESSAGE_TYPES))
    .default(MESSAGE_TYPES.TEXT),
  _destroy: Joi.boolean().default(false)
})

const getAll = async (email) => {
  const db = await GET_DB()
  const query = {
    $or: [
      { email },
      { chatWithUserId: email } // email không bằng chatWithUserId
    ]
  }
  // const conversations = await db
  //   .collection(CONVERSATION_COLLECTION_NAME)
  //   .aggregate([
  //     {
  //       $match: query // Match the conversation based on the email and chatWithUserId
  //     },
  //     {
  //       $lookup: {
  //         from: messageModel.MESSAGE_COLLECTION_NAME, // The messages collection
  //         localField: 'messages', // The field in the conversation collection that holds message IDs
  //         foreignField: '_id', // Match against the _id field in messages collection
  //         as: 'messageDetails' // This will store the result of the lookup
  //       }
  //     }
  //   ])
  //   .sort({ createdAt: -1 })
  //   .toArray()

  const conversations = await db
    .collection(CONVERSATION_COLLECTION_NAME)
    .aggregate([
      {
        $match: query // Match conversations based on email or chatWithUserId
      },
      {
        $lookup: {
          from: messageModel.MESSAGE_COLLECTION_NAME, // The messages collection
          localField: 'messages', // The field in the conversation collection
          foreignField: '_id', // Match against the _id field in the messages collection
          as: 'messageDetails' // Store the matched messages
        }
      }
    ])
    .toArray()

  // Gom tất cả tin nhắn
  // const allMessages = conversations.flatMap((conversation) => conversation.messages)

  // // Sắp xếp tin nhắn theo thời gian
  // allMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  return conversations
}

const createNew = async ({ messages, email, chatWithUserId }) => {
  const db = await GET_DB()
  console.log({ messages, email, chatWithUserId })
  const result = await db.collection(CONVERSATION_COLLECTION_NAME).insertOne({ messages, email, chatWithUserId })
  return result.insertedId
}

const update = async (id, data) => {
  const db = await GET_DB()
  const result = await db.collection(CONVERSATION_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: data
    },
    { returnDocument: 'after' }
  )
  return result
}

const pushMessageId = async (id, messageId) => {
  const db = await GET_DB()

  console.log({ id, messageId })
  const result = await db.collection(CONVERSATION_COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, { $push: { messages: messageId } })
  return result
}

const updateConversation = async (id, data) => {
  const db = await GET_DB()
  const result = await db.collection(CONVERSATION_COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, { $set: data })
  return result
}

const getDetails = async (id) => {
  const db = await GET_DB()
  const conversation = await db.collection(CONVERSATION_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  return conversation
}

const validateBeforeCreate = async (data) => {
  return await CONVERSATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const findConversationByEmailAndChatWithUserId = async (email, chatWithUserId) => {
  if (!email) {
    throw new Error('Email is required')
  }

  const db = await GET_DB() // Get the database instance

  // Build the query dynamically based on whether `chatWithUserId` is provided
  const query = chatWithUserId
    ? {
        $or: [
          { email, chatWithUserId },
          { email: chatWithUserId, chatWithUserId: email }
        ]
      }
    : { $or: [{ chatWithUserId: email }, { email }] }

  try {
    // Using aggregation to get conversation and the related messages
    const conversation = await db
      .collection(CONVERSATION_COLLECTION_NAME)
      .aggregate([
        {
          $match: query // Match the conversation based on the email and chatWithUserId
        },
        {
          $lookup: {
            from: messageModel.MESSAGE_COLLECTION_NAME, // The messages collection
            localField: 'messages', // The field in the conversation collection that holds message IDs
            foreignField: '_id', // Match against the _id field in messages collection
            as: 'messageDetails' // This will store the result of the lookup
          }
        },
        {
          $project: {
            email: 1, // Include email in the output
            chatWithUserId: 1, // Include chatWithUserId in the output
            messageDetails: 1 // Include the joined messageDetails array
          }
        }
      ])
      .toArray()
    // const conversation = await db.collection(CONVERSATION_COLLECTION_NAME).find(query).toArray()
    return conversation
  } catch (error) {
    console.error('Error finding conversation:', error)
    throw new Error('Unable to find conversation')
  }
}

export const conversationModel = {
  CONVERSATION_COLLECTION_NAME,
  CONVERSATION_COLLECTION_SCHEMA,
  validateBeforeCreate,
  getAll,
  createNew,
  pushMessageId,
  findConversationByEmailAndChatWithUserId,
  getDetails,
  updateConversation,
  update
}

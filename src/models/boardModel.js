import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '@/config/mongodb'
import { BOARD_TYPES, NOTIFICATION_INVITATION_STATUS } from '@/utils/constants'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(30).trim().strict(),
  searchVietnamese: Joi.string().required().min(3).max(30).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  ownerId: Joi.string().required().min(3).max(50).trim().strict().email(),
  columnOrderIds: Joi.array().items(Joi.string()).default([]),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
  createAt: Joi.date()
    .timestamp('javascript')
    .default(() => new Date()),
  updateAt: Joi.date().timestamp('javascript').default(null),
  memberGmails: Joi.array().items(Joi.string()).default([]),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createAt']

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const db = await GET_DB()
    const validData = await validateBeforeCreate(data)
    const createBoard = await db.collection(BOARD_COLLECTION_NAME).insertOne(validData)
    return createBoard
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (boardId) => {
  try {
    const db = await GET_DB()
    const createBoard = await db.collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(boardId)
    })
    return createBoard
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async (boardId, email, isOwner = false) => {
  try {
    const db = await GET_DB()
    const result = await db
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(boardId),
            _destroy: false
          }
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'columns'
          }
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'cards'
          }
        }
      ])
      .toArray()

    const memberGmails = result[0].memberGmails.map((member) => member.email)
    const ownerId = result[0].ownerId
    if (memberGmails.includes(email) || ownerId === email || isOwner) {
      return result[0] || null
    }

    throw new Error('You do not have permission to access this board')
  } catch (error) {
    throw new Error(error)
  }
}

const pushColumnOrderIds = async (column) => {
  try {
    const db = await GET_DB()
    const result = await db.collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      {
        $push: { columnOrderIds: new ObjectId(column._id) }
      },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (boardId, updateData) => {
  try {
    Object.keys(updateData).forEach((fields) => {
      if (INVALID_UPDATE_FIELDS.includes(fields)) {
        delete updateData[fields]
      }
    })

    // xử lí string để objectId

    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map((columnId) => new ObjectId(columnId))
    }

    const db = await GET_DB()

    const result = await db.collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      {
        $set: updateData
      },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const pullColumnOrderIds = async (column) => {
  try {
    const db = await GET_DB()
    const result = await db.collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      {
        $pull: { columnOrderIds: new ObjectId(column._id) }
      },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const addMemberToBoard = async (boardId, memberGmails, status) => {
  try {
    const db = await GET_DB()
    const result = await db.collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      {
        $addToSet: {
          memberGmails: {
            $each: memberGmails.map((email) => ({
              email,
              status
            }))
          }
        }
      },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async (email) => {
  try {
    const db = await GET_DB()
    const result = await db.collection(BOARD_COLLECTION_NAME).find({ _destroy: false, ownerId: email }).sort({ updateAt: -1 }).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const searchBoard = async (keyword, email) => {
  try {
    // Validate inputs
    if (!keyword || !email) {
      throw new Error('Keyword and email are required for search')
    }

    const db = await GET_DB()
    const result = await db
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _destroy: false,
            searchVietnamese: { $regex: keyword, $options: 'i' },
            $or: [{ ownerId: email }, { 'memberGmails.email': email }]
          }
        }
      ])
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteBoard = async (boardId) => {
  const db = await GET_DB()
  const result = await db
    .collection(BOARD_COLLECTION_NAME)
    .findOneAndUpdate({ _id: new ObjectId(boardId) }, { $set: { _destroy: true } }, { returnDocument: 'after' })
  return result
}

const updateTypeBoard = async (boardId, type) => {
  const db = await GET_DB()
  const result = await db.collection(BOARD_COLLECTION_NAME).findOneAndUpdate({ _id: new ObjectId(boardId) }, { $set: { type } }, { returnDocument: 'after' })
  return result
}

const getWorkspace = async (email) => {
  const db = await GET_DB()
  const result = await db
    .collection(BOARD_COLLECTION_NAME)
    .find({
      'memberGmails.email': email,
      'memberGmails.status': NOTIFICATION_INVITATION_STATUS.ACCEPTED
    })
    .sort({ updateAt: -1 })
    .toArray()
  return result
}

const deleteMemberFromBoard = async (boardId, email) => {
  const db = await GET_DB()
  const result = await db
    .collection(BOARD_COLLECTION_NAME)
    .findOneAndUpdate({ _id: new ObjectId(boardId) }, { $pull: { memberGmails: { email } } }, { returnDocument: 'after' })
  return result
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds,
  addMemberToBoard,
  getAll,
  searchBoard,
  deleteBoard,
  updateTypeBoard,
  getWorkspace,
  deleteMemberFromBoard
}

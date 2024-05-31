import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  cardOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'updateAt']

const validateBeforeCreate = async (data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const db = await GET_DB()
    const validData = await validateBeforeCreate(data)

    const createColumn = await db.collection(COLUMN_COLLECTION_NAME).insertOne({
      ...validData,
      boardId: new ObjectId(validData.boardId)
    })

    return createColumn
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (boardId) => {
  try {
    const db = await GET_DB()
    const createColumn = await db.collection(COLUMN_COLLECTION_NAME).findOne({
      _id: new ObjectId(boardId)
    })
    return createColumn
  } catch (error) {
    throw new Error(error)
  }
}

const pushCardOrderIds = async (card) => {
  try {
    const db = await GET_DB()
    const result = await db.collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(card.columnId) },
      {
        $push: { cardOrderIds: new ObjectId(card._id) }
      },
      { returnDocument: 'after' }
    )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (columnId, updateData) => {
  // eslint-disable-next-line no-useless-catch
  try {
    Object.keys(updateData).forEach((fields) => {
      if (INVALID_UPDATE_FIELDS.includes(fields)) {
        delete updateData[fields]
      }
    })

    // xử li string => objectId
    if (updateData.cardOrderIds) updateData.cardOrderIds = updateData.cardOrderIds.map((cardId) => new ObjectId(cardId))

    const db = await GET_DB()
    const result = await db.collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(columnId) },
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

const deleteOneById = async (columnId) => {
  try {
    const db = await GET_DB()
    const result = await db.collection(COLUMN_COLLECTION_NAME).deleteOne({ _id: new ObjectId(columnId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const pullCardOrderIds = async (column) => {
  try {
    const db = await GET_DB()
    const result = await db.collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.columnId) },
      {
        $pull: { cardOrderIds: new ObjectId(column._id) }
      },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds,
  pullCardOrderIds,
  update,
  deleteOneById
}

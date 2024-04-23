import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { columnModel } from './columnModel'
import { boardModel } from './boardModel'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().min(3).max(50).trim().strict().email(),
  fullName: Joi.string().required().min(3).max(50).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})

const checkIfUserExists = async (email) => {
  try {
    const db = await GET_DB()
    const existingUser = await db.collection(USER_COLLECTION_NAME).findOne({ email: email })
    return existingUser
  } catch (error) {
    throw new Error(error)
  }
}

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const db = await GET_DB()
    const validData = await validateBeforeCreate(data)
    const isUserExists = await checkIfUserExists(validData.email)

    if (isUserExists) return isUserExists

    const createBoard = await db.collection(USER_COLLECTION_NAME).insertOne(validData)

    return createBoard
  } catch (error) {
    throw new Error(error)
  }
}
const getDetails = async (email) => {
  try {
    const db = await GET_DB()
    const result = await db
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .aggregate([{ $match: { ownerId: email } }])
      .toArray()

    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  getDetails
}

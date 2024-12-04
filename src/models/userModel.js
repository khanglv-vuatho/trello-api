import Joi from 'joi'
import { GET_DB } from '@/config/mongodb'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().min(3).max(50).trim().strict().email(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  verified_email: Joi.boolean().required(),
  name: Joi.string().required(),
  given_name: Joi.string().required(),
  picture: Joi.string().uri().required(),
  displayName: Joi.string().default(Joi.ref('name')),
  // google token
  token: Joi.string().default(null),
  access_token: Joi.string().default(null)
})

const checkIfUserExists = async (email) => {
  try {
    const db = await GET_DB()
    const existingUser = await db.collection(USER_COLLECTION_NAME).findOne({ email })
    return existingUser
  } catch (error) {
    throw new Error(error)
  }
}

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false, allowUnknown: true })
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

    const result = await db.collection(USER_COLLECTION_NAME).findOne({ email })

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmail = async (email) => {
  const db = await GET_DB()
  const result = await db.collection(USER_COLLECTION_NAME).findOne({ email })
  return result
}

const update = async (email, data) => {
  const db = await GET_DB()
  const updateData = { ...data, updatedAt: Date.now() }
  const result = await db.collection(USER_COLLECTION_NAME).findOneAndUpdate({ email }, { $set: updateData }, { returnDocument: 'after' })
  return result
}

const getMe = async (email) => {
  const db = await GET_DB()
  const result = await db.collection(USER_COLLECTION_NAME).findOne({ email })
  if (!result) return null

  return result
}

const getNotification = async (email) => {
  const db = await GET_DB()
  const result = await db.collection(USER_COLLECTION_NAME).findOne({ email }, { projection: { notification: 1 } })
  return result
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  getDetails,
  findOneByEmail,
  update,
  getMe,
  getNotification
}

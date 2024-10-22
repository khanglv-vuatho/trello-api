import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

const generateToken = (user, tokenLife = '1h') => {
  const userData = createUserData(user)
  return jwt.sign({ data: userData }, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: tokenLife
  })
}

const INVALID_UPDATE_FIELDS = ['_id', 'email']

// Helper function to create user data for the token
const createUserData = (user) => {
  if (!user) return {}
  return Object.keys(user).reduce((acc, field) => {
    if (!INVALID_UPDATE_FIELDS.includes(field)) {
      acc[field] = user[field]
    }
    return acc
  }, {})
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.JWT_SECRET)
  } catch (error) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Invalid token')
  }
}

const updateToken = (user, tokenLife) => {
  const userData = createUserData(user)
  return jwt.sign({ data: userData }, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: tokenLife
  })
}

export { generateToken, verifyToken, updateToken }

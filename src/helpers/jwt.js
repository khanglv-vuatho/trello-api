import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from '@/config/environment'
import ApiError from '@/utils/ApiError'

const generateToken = (user) => {
  return jwt.sign(user, env.JWT_SECRET, {
    algorithm: 'HS256'
  })
}

const createToken = (user) => {
  return jwt.sign(user, env.JWT_SECRET, {
    algorithm: 'HS256'
  })
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.JWT_SECRET)
  } catch (error) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Invalid token')
  }
}

const updateToken = (user, tokenLife) => {
  return jwt.sign(user, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: tokenLife
  })
}

export { generateToken, verifyToken, updateToken, createToken }

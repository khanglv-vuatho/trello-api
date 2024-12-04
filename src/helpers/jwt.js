import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from '@/config/environment'
import ApiError from '@/utils/ApiError'

const generateToken = (user, tokenLife = '1h') => {
  return jwt.sign(user, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: tokenLife
  })
}

const createToken = (user, tokenLife = '24h') => {
  return jwt.sign(user, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: tokenLife
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

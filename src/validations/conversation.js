import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/ApiError'
import { MESSAGE_TYPES } from '@/utils/constants'

const sendMessage = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().trim().strict().required(),
    chatWithUserId: Joi.string().email().trim().strict().required(),
    type: Joi.string()
      .valid(...Object.values(MESSAGE_TYPES))
      .default(MESSAGE_TYPES.TEXT)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export { sendMessage }

import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '@/utils/ApiError'

const getAll = async (req, res, next) => {
  const correctCondition = Joi.object({
    ownerId: Joi.string().required()
  })
  try {
    await correctCondition.validateAsync(req.query, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const notificationValidation = {
  getAll
}

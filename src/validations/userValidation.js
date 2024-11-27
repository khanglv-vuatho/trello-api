import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().trim().strict().required(),
    verified_email: Joi.boolean().required(),
    name: Joi.string().required(),
    given_name: Joi.string().required(),
    picture: Joi.string().uri().required()
  })
  try {
    // set abortEarly: false trả ra nhiều lỗi validation nếu có
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const userValidation = {
  createNew
}

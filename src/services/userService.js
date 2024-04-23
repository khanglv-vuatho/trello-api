import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newUser = {
      ...reqBody
    }

    const createdUser = await userModel.createNew(newUser)
    const dataUser = await userModel.getDetails(createdUser.email)

    return dataUser
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew
}

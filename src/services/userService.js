import { StatusCodes } from 'http-status-codes'
import { generateToken, verifyToken } from '~/helpers/jwt'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newUser = {
      ...reqBody
    }
    //check if user already exists
    const user = await userModel.getDetails(newUser.email)
    if (user) {
      return {
        ...user,
        detailUser: verifyToken(user.token)
      }
    }

    // handle create a  token for user

    const userPayload = generateToken(newUser)
    const createdUser = await userModel.createNew(newUser)
    const dataUser = await userModel.getDetails(createdUser.email)
    return {
      ...dataUser,
      detailUser: userPayload
    }
  } catch (error) {
    throw error
  }
}
const getDetails = async (email) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await userModel.getDetails(email)

    if (!user) {
      return { email, status: 'pending' }
    }

    return user
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew,
  getDetails
}

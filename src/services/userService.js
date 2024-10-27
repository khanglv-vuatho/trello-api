import { userModel } from '~/models/userModel'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newUser = {
      ...reqBody
    }
    //check if user already exists
    const user = await userModel.getDetails(newUser.email)
    if (user) return user

    const createdUser = await userModel.createNew(newUser)
    const dataUser = await userModel.getDetails(createdUser.email)
    return dataUser
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

const getMe = async (email, tokenGoogle) => {
  const user = await userModel.getDetails(email)
  return user
}

export const userService = {
  createNew,
  getDetails,
  getMe
}

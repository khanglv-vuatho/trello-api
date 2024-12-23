import { userModel } from '@/models/userModel'
import { deleteFile, uploadFile } from '@/worker'
import { v4 as uuidv4 } from 'uuid'
import { env } from '@/config/environment'
import { createToken } from '@/helpers/jwt'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const accessToken = createToken(reqBody, '24h')

    const newUser = {
      ...reqBody,
      access_token: accessToken
    }

    //check if user already exists
    const user = await userModel.getDetails(newUser.email)
    if (user) return user

    //create new user to db
    await userModel.createNew(newUser)
    // const dataUser = await userModel.getDetails(createdUser.email)
    // console.log({ dataUser, createdUser })
    return newUser
  } catch (error) {
    throw error
  }
}
const getDetails = async (email) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await userModel.getDetails(email)

    if (!user) {
      return email
    }

    return user
  } catch (error) {
    throw error
  }
}

const getMe = async (email) => {
  const user = await userModel.getDetails(email)
  return user
}

const getNotification = async (email) => {
  const notification = await userModel.getNotification(email)
  return notification
}

const update = async (email, reqBody, file) => {
  const uuid = uuidv4()
  const url = `${env.WORKER_API_URL}/${uuid}`
  const userUpdate = await userModel.getDetails(email)
  if (userUpdate?.picture?.includes(env.WORKER_API_URL)) {
    await deleteFile(userUpdate.picture)
  }
  // upload file if provided
  if (file) {
    await uploadFile(url, file?.buffer)
  }
  // update user with new data
  const reqBodyUpdate = file ? { ...reqBody, picture: url } : { ...reqBody }
  const user = await userModel.update(email, reqBodyUpdate)

  return user
}

export const userService = {
  createNew,
  getDetails,
  getMe,
  getNotification,
  update
}

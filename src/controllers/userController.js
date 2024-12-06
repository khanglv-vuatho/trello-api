import { StatusCodes } from 'http-status-codes'
import { userService } from '@/services/userService'

const update = async (req, res, next) => {
  try {
    const { email } = req.params
    const file = req.file
    const user = await userService.update(email, req.body, file)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const createNew = async (req, res, next) => {
  try {
    const payload = { ...req.body }
    // Điều hướng sang service
    const createUser = await userService.createNew(payload)
    res.status(StatusCodes.OK).json({
      recentBoard: [],
      boards: createUser
    })
  } catch (error) {
    //next(error) để đẩy sang errorhandling
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    // const { user: userAuth } = req

    const { email } = req.params
    // const isOwner = userAuth.email === email
    const user = await userService.getDetails(email)

    delete user.access_token
    // if (!isOwner) return res.status(StatusCodes.OK).json(user)
    // const notification = await userService.getNotification(email)
    res.status(StatusCodes.OK).json({ user })
  } catch (error) {
    next(error)
  }
}

const getMe = async (req, res, next) => {
  try {
    const { email } = req.user
    const user = await userService.getDetails(email)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  getDetails,
  getMe,
  update
}

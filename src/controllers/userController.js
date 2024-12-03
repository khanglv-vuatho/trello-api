import { StatusCodes } from 'http-status-codes'
import { updateToken } from '@/helpers/jwt'
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
    const token = updateToken({ ...req.body }, '24h')

    const payload = { ...req.body, token }
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
    const notification = await userService.getNotification(req.params.email)
    const user = await userService.getDetails(req.params.email)
    res.status(StatusCodes.OK).json({ user, notification })
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

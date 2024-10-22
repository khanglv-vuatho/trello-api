import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { userService } from '~/services/userService'
import jwt from 'jsonwebtoken'
import { updateToken } from '~/helpers/jwt'

const createNew = async (req, res, next) => {
  try {
    const token = updateToken({ ...req.body }, '1h')

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
    console.log(req.params.email)
    const user = await userService.getDetails(req.params.email)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  getDetails
}

import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const createNew = async (req, res, next) => {
  try {
    // Điều hướng sang service
    const createUser = await userService.createNew(req.body)

    res.status(StatusCodes.CREATED).json({
      recentBoard: [],
      boards: createUser
    })
  } catch (error) {
    //next(error) để đẩy sang errorhandling
    next(error)
  }
}

export const userController = {
  createNew
}

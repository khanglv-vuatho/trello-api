import { StatusCodes } from 'http-status-codes'
import { notificationService } from '~/services/notificationService'

const getAll = async (req, res, next) => {
  try {
    const { ownerId } = req.query
    const notifications = await notificationService.getAll(ownerId)
    res.status(StatusCodes.OK).json(notifications)
  } catch (error) {
    next(error)
  }
}

export const notificationController = {
  getAll
}

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

const deleteOne = async (req, res, next) => {
  try {
    const { id } = req.params
    await notificationService.deleteOne(id)
    res.status(StatusCodes.OK).json({ message: 'Delete notification successfully' })
  } catch (error) {
    next(error)
  }
}

const updateStatusInvitation = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = req.body
    await notificationService.updateStatusInvitation(id, data)
    res.status(StatusCodes.OK).json({ message: 'Update notification successfully' })
  } catch (error) {
    next(error)
  }
}

export const notificationController = {
  getAll,
  deleteOne,
  updateStatusInvitation
}

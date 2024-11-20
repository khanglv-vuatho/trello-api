import { notificationModel } from '~/models/notificationModel'

const createNew = async (data) => {
  const notification = await notificationModel.createNew(data)
  return notification
}
const findByOwnerId = async (ownerId) => {
  const notifications = await notificationModel.findByOwnerId(ownerId)
  return notifications
}

const getAll = async (ownerId) => {
  const notifications = await notificationModel.getAll(ownerId)
  return notifications
}

export const notificationService = {
  createNew,
  findByOwnerId,
  getAll
}

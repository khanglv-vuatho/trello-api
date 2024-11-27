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

const deleteOne = async (id) => {
  const notification = await notificationModel.deleteOne(id)
  return notification
}

const updateStatusInvitation = async (id, data) => {
  const notification = await notificationModel.updateStatusInvitation(id, data)
  return notification
}

export const notificationService = {
  createNew,
  findByOwnerId,
  getAll,
  deleteOne,
  updateStatusInvitation
}

import { messageModel } from '@/models/message'

const createNew = async (data) => {
  const message = await messageModel.createNew(data)
  return message
}

const getAll = async (email) => {
  const messages = await messageModel.getAll(email)
  return messages
}

const getDetails = async (id) => {
  const message = await messageModel.getDetails(id)
  return message
}

export const messageService = {
  createNew,
  getAll,
  getDetails
}

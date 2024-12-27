import { messageService } from '@/services/messageService'

const createNew = async (data) => {
  const message = await messageService.createNew(data)
  return message
}

const getDetails = async (id) => {
  const message = await messageService.getDetails(id)
  return message
}

export const messageController = {
  createNew,
  getDetails
}

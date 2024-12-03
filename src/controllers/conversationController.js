import { conversationModel } from '@/models/conversation'
import { messageModel } from '@/models/message'
import { MESSAGE_TYPES } from '@/utils/constants'
import { uploadFile } from '@/worker'
import { StatusCodes } from 'http-status-codes'
import { env } from '@/config/environment'
import { v4 as uuidv4 } from 'uuid'
const getAll = async (req, res, next) => {
  try {
    const { email } = req.params
    const conversations = await conversationModel.getAll(email)
    return res.status(StatusCodes.OK).json(conversations)
  } catch (error) {
    next(error)
  }
}

const createNew = async (req, res, next) => {
  try {
    const { email } = req.params
    const { content, chatWithUserId } = req.body
    const file = req.file

    // Set message type based on whether there's a file
    const type = file ? MESSAGE_TYPES.IMAGE : MESSAGE_TYPES.TEXT
    // const uuid = uuidv4()
    // const url = `${env.WORKER_API_URL}/${uuid}`
    // // upload file if provided
    // if (file) {
    //   await uploadFile(url, file?.buffer)
    // }

    // Create a new message
    const newMessage = await messageModel.createNew(content, type)

    // Create a conversation using the message ID
    const conversation = await conversationModel.createNew(email, newMessage._id.toString(), chatWithUserId)

    // Respond with the new conversation
    return res.status(StatusCodes.CREATED).json(conversation)
  } catch (error) {
    next(error) // Handle any errors
  }
}

export const conversationController = {
  getAll,
  createNew
}

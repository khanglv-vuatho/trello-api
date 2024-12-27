import { conversationModel } from '@/models/conversation'
import { conversationService } from '@/services/conversationService'
import { MESSAGE_TYPES, SOCKET_EVENTS } from '@/utils/constants'
import { StatusCodes } from 'http-status-codes'
import { messageController } from '@/controllers/messageController'
import { sendDataSocketToClient, sendDataSocketToGroupClient } from '@/sockets'

const getAll = async (req, res, next) => {
  try {
    const { email } = req.user
    const conversations = await conversationService.getAll(email)
    return res.status(StatusCodes.OK).json(conversations)
  } catch (error) {
    next(error)
  }
}

const createNew = async (req, res, next) => {
  try {
    const { email } = req.user

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
    const messsage = { content, type, createdAt: Date.now(), email, chatWithUserId }

    sendDataSocketToGroupClient([chatWithUserId], SOCKET_EVENTS.MESSAGE_ARRIVED, messsage)

    const messsageId = await messageController.createNew(messsage)
    const [conversationExit] = await conversationModel.findConversationByEmailAndChatWithUserId(email, chatWithUserId)
    if (conversationExit) {
      // console.log({ conversationExit })
      await conversationModel.pushMessageId(conversationExit._id, messsageId)
    } else {
      await conversationModel.createNew({ messages: [messsageId], email, chatWithUserId })
      // await conversationModel.createNew({ messages: { messageId: newMessage._id }, email, chatWithUserId })
    }
    res.status(StatusCodes.CREATED).json({ message: 'Send message success' })
  } catch (error) {
    next(error) // Handle any errors
  }
}

export const conversationController = {
  getAll,
  createNew
}

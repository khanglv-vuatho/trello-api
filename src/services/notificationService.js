import { boardModel } from '@/models/boardModel'
import { notificationModel } from '@/models/notificationModel'

const createNew = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const notification = await notificationModel.createNew(data)
    return notification
  } catch (error) {
    throw error
  }
}
const findByOwnerId = async (ownerId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const notifications = await notificationModel.findByOwnerId(ownerId)
    return notifications
  } catch (error) {
    throw error
  }
}

const getAll = async (ownerId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const notifications = await notificationModel.getAll(ownerId)
    return notifications
  } catch (error) {
    throw error
  }
}

const deleteOne = async (id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const notification = await notificationModel.deleteOne(id)
    return notification
  } catch (error) {
    throw error
  }
}

const updateStatusInvitation = async (id, data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    //{ status: 'accepted', email: 'vikastudy57@gmail.com', boardId }
    const board = await boardModel.getDetails(data?.boardId, data.email, true)
    if (!board) {
      throw new Error('Board not found')
    }

    const memberGmailsUpdate = board.memberGmails.map((memberGmail) => {
      if (memberGmail.email === data.email) {
        return { ...memberGmail, status: data.status }
      }
      return memberGmail
    })

    if (board.ownerId === data.email) {
      throw new Error('You are the owner of this board')
    }

    if (!board.memberGmails.some((memberGmail) => memberGmail.email === data.email)) {
      throw new Error('You are not a member of this board')
    }

    await boardModel.update(data?.boardId, { memberGmails: memberGmailsUpdate })
    const notification = await notificationModel.updateStatusInvitation(id, data)

    return notification
  } catch (error) {
    throw error
  }
}

export const notificationService = {
  createNew,
  findByOwnerId,
  getAll,
  deleteOne,
  updateStatusInvitation
}

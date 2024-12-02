import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { normalizeKeyword } from '@/helpers/normallize'
import sendMail from '@/helpers/sendMail'
import { boardModel } from '@/models/boardModel'
import { cardModel } from '@/models/cardModel'
import { columnModel } from '@/models/columnModel'
import ApiError from '@/utils/ApiError'
import { slugify } from '@/utils/formatters'
import { notificationService } from './notificationService'
import { NOTIFICATION_INVITATION_STATUS, NOTIFICATION_STATUS, NOTIFICATION_TYPES } from '@/utils/constants'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
      searchVietnamese: normalizeKeyword(reqBody.title)
    }

    const createdBoard = await boardModel.createNew(newBoard)

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (boardId, email) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const board = await boardModel.getDetails(boardId, email)
    if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')

    const resBoard = cloneDeep(board)

    resBoard.columns.forEach((column) => {
      //equals because typeof _id is ObjectId so convert to String or using equals to compare
      column.cards = resBoard.cards.filter((card) => card.columnId.equals(column._id))
    })
    // update updateAt field
    await boardModel.update(boardId, { updateAt: Date.now() })

    return resBoard
  } catch (error) {
    throw error
  }
}

const update = async (boardId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }

    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) {
    throw error
  }
}

const moveCardToDifferentColumn = async (reqBody) => {
  const { currentCardId, prevColumnId, prevCardOrderIds, nextColumnId, nextCardOrderIds } = reqBody
  // eslint-disable-next-line no-useless-catch
  try {
    //bước 1 :  cập nhật mảng orderCardIds của column ban đầu chứa nó (hiều bản chất là xoá cái _id của card ra khỏi mảng orderCardIds)

    await columnModel.update(prevColumnId, {
      cardOrderIds: prevCardOrderIds,
      updateAt: Date.now()
    })

    // bước 2: cập nhật mảng orderCardIds của column tiếp theo (hiểu bản chất là thêm cái _id của card vào mảng orderCardIds)

    await columnModel.update(nextColumnId, {
      cardOrderIds: nextCardOrderIds,
      updateAt: Date.now()
    })
    // bước 3: cập nhật lại trường columnId mới của cái card đã kéo

    await cardModel.update(currentCardId, {
      columnId: nextColumnId
    })

    return { updateResult: 'Successfully!' }
  } catch (error) {
    throw error
  }
}

const addMemberToBoard = async (boardId, memberGmails) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const board = await boardModel.findOneById(boardId)
    // check if board exists
    if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')

    // check if memberGmails is in board.memberGmails
    if (board?.memberGmails?.some((member) => memberGmails?.includes(member.email))) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Member already exists')
    }
    // check if owner is in memberGmails
    if (board?.memberGmails?.includes(board.memberGmails)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Owner cannot be added to the board')
    }

    // send mail to member
    await Promise.all(
      memberGmails.map((email) =>
        sendMail({
          to: email,
          from: board.ownerId,
          subject: 'You are invited to join a Trello board!',
          url: 'accept-invitation',
          username: email,
          data: {
            boardId,
            status: NOTIFICATION_INVITATION_STATUS.ACCEPTED
          }
        })
      )
    )

    const updatedBoard = await boardModel.addMemberToBoard(boardId, memberGmails, NOTIFICATION_INVITATION_STATUS.PENDING)

    const invitation = {
      boardId,
      boardTitle: updatedBoard.title,
      status: 'pending'
    }

    await Promise.all(
      memberGmails.map((email) =>
        notificationService.createNew({
          ownerId: email,
          authorId: board.ownerId,
          status: NOTIFICATION_STATUS.UNREAD,
          type: NOTIFICATION_TYPES.INVITE,
          title: `You are invited to join a board ${updatedBoard.title}!`,
          invitation
        })
      )
    )

    return updatedBoard
  } catch (error) {
    throw error
  }
}

const getAll = async (email) => {
  const boards = await boardModel.getAll(email)
  const workspace = await boardModel.getWorkspace(email)
  return { boards, workspace }
}

const searchBoard = async (keyword, email) => {
  const boards = await boardModel.searchBoard(keyword, email)
  return boards
}

const deleteBoard = async (boardId) => {
  const board = await boardModel.deleteBoard(boardId)
  return board
}

const updateTypeBoard = async (boardId, type) => {
  const board = await boardModel.updateTypeBoard(boardId, type)
  return board
}
const deleteMemberFromBoard = async (boardId, email) => {
  const board = await boardModel.deleteMemberFromBoard(boardId, email)
  return board
}

export const boardService = {
  createNew,
  getAll,
  getDetails,
  update,
  moveCardToDifferentColumn,
  addMemberToBoard,
  searchBoard,
  deleteBoard,
  updateTypeBoard,
  deleteMemberFromBoard
}

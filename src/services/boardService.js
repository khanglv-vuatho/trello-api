import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { normalizeKeyword } from '~/helpers/normallize'
import sendMail from '~/helpers/sendMail'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

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

const getDetails = async (boardId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')

    const resBoard = cloneDeep(board)

    resBoard.columns.forEach((column) => {
      //equals because typeof _id is ObjectId so convert to String or using equals to compare
      column.cards = resBoard.cards.filter((card) => card.columnId.equals(column._id))
    })

    delete resBoard.cards

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

    // check if owner is in memberGmails
    if (board.memberGmails.includes(board.ownerId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Owner cannot be added to the board')
    }
    // check if memberGmails is in board.memberGmails
    if (board.memberGmails.some((email) => memberGmails.includes(email))) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Member already exists')
    }

    // send mail to member
    await Promise.all(
      memberGmails.map((email) =>
        sendMail({
          to: email,
          subject: 'You are invited to join a Trello board!',
          username: email
        })
      )
    )
    const updatedBoard = await boardModel.addMemberToBoard(boardId, memberGmails)
    // update notification of user
    // const notification = {
    //   type: 'invite',
    //   title: 'You are invited to join a Trello board 123!',
    //   ownerId: board.ownerId,
    //   boardId,
    //   boardTitle: updatedBoard.title
    // }
    // await userModel.pushNotification(board.ownerId, notification)

    return updatedBoard
  } catch (error) {
    throw error
  }
}

const removeMemberFromBoard = async (boardId, memberGmails) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const board = await boardModel.removeMemberFromBoard(boardId, memberGmails)
    return board
  } catch (error) {
    throw error
  }
}

const getAll = async (email) => {
  const boards = await boardModel.getAll(email)
  return boards
}

const search = async (keyword) => {
  const boards = await boardModel.search(keyword)
  return boards
}

export const boardService = {
  createNew,
  getAll,
  getDetails,
  update,
  moveCardToDifferentColumn,
  addMemberToBoard,
  removeMemberFromBoard,
  search
}

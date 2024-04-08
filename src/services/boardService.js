import { slugify } from '~/utils/formatters'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { boardModel } from '~/models/boardModel'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
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

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}

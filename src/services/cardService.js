import { StatusCodes } from 'http-status-codes'
import { cardModel } from '@/models/cardModel'
import { columnModel } from '@/models/columnModel'
import ApiError from '@/utils/ApiError'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newCard = {
      ...reqBody
    }

    const createdCard = await cardModel.createNew(newCard)

    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) {
    throw error
  }
}

const deleteCard = async (cardId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const targetModel = await cardModel.findOneById(cardId)
    if (!targetModel) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found')
    }

    await cardModel.deleteOneById(cardId)
    await columnModel.pullCardOrderIds(targetModel)

    // await columnModel.deleteOneById(columnId)
    // await cardModel.deleteManyByColumnId(columnId)
    // await boardModel.pullColumnOrderIds(targetColumn)
    return { deleteDefault: 'Card deleted successfully!' }
  } catch (error) {
    throw error
  }
}

const update = async (cardId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody
    }
    const updatedCard = await cardModel.update(cardId, updateData)
    return updatedCard
  } catch (error) {
    throw error
  }
}

const updateDetailCard = async (cardId, updateData) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedDetailCard = await cardModel.updateDetailCard(cardId, updateData)
    return updatedDetailCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
  deleteCard,
  update,
  updateDetailCard
}

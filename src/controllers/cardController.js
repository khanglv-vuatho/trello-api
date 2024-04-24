import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'

const createNew = async (req, res, next) => {
  try {
    // Điều hướng sang service
    const createcard = await cardService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createcard)
  } catch (error) {
    //next(error) để đẩy sang errorhandling
    next(error)
  }
}

const deleteCard = async (req, res, next) => {
  try {
    // Điều hướng sang service
    const deleteCard = await cardService.deleteCard(req.body.cardId)
    res.status(StatusCodes.OK).json(deleteCard)
  } catch (error) {
    //next(error) để đắy sang errorhandling
    next(error)
  }
}

export const cardController = {
  createNew,
  deleteCard
}

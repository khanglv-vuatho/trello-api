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

export const cardController = {
  createNew
}

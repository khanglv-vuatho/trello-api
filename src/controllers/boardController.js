import { StatusCodes } from 'http-status-codes'

const createNew = (req, res, next) => {
  try {
    console.log(req.body)
    res.status(StatusCodes.CREATED).json({ message: 'POST from board controller: create new board' })
  } catch (error) {
    //next(error) để đẩy sang errorhandling
    next(error)
  }
}

export const boardController = {
  createNew
}

import { StatusCodes } from 'http-status-codes'

const createNew = (req, res, next) => {
  try {
    console.log(req.body)

    res.status(StatusCodes.CREATED).json({ message: 'POST from board controller: create new board' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    })
  }
}

export const boardController = {
  createNew
}

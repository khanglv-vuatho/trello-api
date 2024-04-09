import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const createNew = async (req, res, next) => {
  try {
    // Điều hướng sang service
    const createColumn = await columnService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createColumn)
  } catch (error) {
    //next(error) để đẩy sang errorhandling
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const columnId = req.params.id
    // Điều hướng sang service
    const updateColumn = await columnService.update(columnId, req.body)
    res.status(StatusCodes.OK).json(updateColumn)
  } catch (error) {
    //next(error) để đầuy sang errorhandling
    next(error)
  }
}
const deleteColumn = async (req, res, next) => {
  try {
    const columnId = req.params.id
    // Điều hướng sang service
    const deleteColumn = await columnService.deleteColumn(columnId)
    res.status(StatusCodes.OK).json(deleteColumn)
  } catch (error) {
    //next(error) để đắy sang errorhandling
    next(error)
  }
}

export const columnController = {
  createNew,
  update,
  deleteColumn
}

import { StatusCodes } from 'http-status-codes'
import { boardService } from '@/services/boardService'
import { BOARD_MEMBER_ROLE, MEMBER_STATUS } from '@/utils/constants'
import ApiError from '@/utils/ApiError'
import { errorHandlingMiddleware } from './errorHandlingMiddleware'

export const checkPermission = (action) => async (req, res, next) => {
  try {
    const { user } = req
    const boardId = req.params.id
    const email = req.query.email || req.body.email || user.email
    if (!email) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email is required')
    }
    // Get board details from service layer
    const board = await boardService.getDetails(boardId, email)
    if (!board || board._destroy) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found or deleted')
    }

    // Find user in board members
    const member = board.memberGmails?.find((m) => m.email === email)
    const isOwner = board.ownerId == email
    if ((!member || member.status !== MEMBER_STATUS.ACCEPTED) && !isOwner) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Access denied: Not an accepted member of this board')
    }
    // Check permissions for the requested action
    const allowedRoles = board.permissions?.[action] || []
    if (!allowedRoles?.includes(member?.role) && !isOwner) {
      throw new ApiError(StatusCodes.FORBIDDEN, `Access denied: You need ${allowedRoles.join(' or ')} permission`)
    }

    next()
  } catch (error) {
    errorHandlingMiddleware(error, req, res, next) // Pass error to error handling middleware
  }
}

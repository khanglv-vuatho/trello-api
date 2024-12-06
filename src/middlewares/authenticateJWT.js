import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from '@/config/environment'
import ApiError from '@/utils/ApiError'

// Middleware for JWT authentication
const authenticateJWT = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization

  // Token is typically in the format: 'Bearer <token>'
  const token = authHeader.split(' ')[1]
  if (!token) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'No token provided')
  }

  // Verify and decode the token
  jwt.verify(token, env.JWT_SECRET, (err, user) => {
    if (err) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Invalid token')
    }
    // If the token is valid, save user information to req.user
    req.user = user // Store user info in request object
    // Proceed to the next middleware or route handler
    next()
  })
}

export { authenticateJWT }

import { SOCKET_EVENTS } from '@/utils/constants'
import { Server } from 'socket.io'
let io

let userSocketMap = {}
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    // Register the user when they provide a username
    socket.on(SOCKET_EVENTS.REGISTER, (email) => {
      userSocketMap[email] = socket.id // Store socket ID for the user
      console.log(`User ${email} registered with socket ID ${socket.id}`)
    })

    socket.on(SOCKET_EVENTS.JOIN_BOARD, (roomName) => {
      socket.join(roomName) // Add the user to the room
      console.log(`User with ID ${socket.id} joined room ${roomName}`)
    })

    // Handle user disconnection and cleanup
    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      // Clean up when a user disconnects
      for (let username in userSocketMap) {
        if (userSocketMap[username] === socket.id) {
          delete userSocketMap[username] // Remove the user from the socket map
          console.log(`User ${username} disconnected and removed from socket map`)
          break
        }
      }
    })
  })

  return io
}

const sendDataSocketToClient = (email, notificationData) => {
  const socketId = userSocketMap[email]
  if (socketId) {
    io.to(socketId).emit(SOCKET_EVENTS.NOTIFICATION, notificationData)
    console.log(`Notification sent to ${email}`)
  } else {
    console.log(`No socket found for user ${email}`)
  }
}

const sendDataSocketToGroupClient = (emails, event, notificationData) => {
  if (!emails) return
  console.log({ userSocketMap, emails })
  emails?.forEach((email) => {
    const socketId = userSocketMap[email] // Get the socket ID for the user
    console.log({ socketId, email })
    if (socketId) {
      io.to(socketId).emit('updateMember', notificationData) // Emit notification to the user
      console.log(`Notification sent to ${email}`)
    } else {
      console.log(`No socket found for user ${email}, skipping notification`)
    }
  })
}
export { initSocket, sendDataSocketToClient, sendDataSocketToGroupClient }

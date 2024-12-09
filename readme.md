# Project Management API

A RESTful API backend service for a project management application similar to Trello, built with Node.js, Express, and MongoDB.

## Features

- **Board Management**

  - Create, read, update, and delete boards
  - Public/private board settings
  - Board member management with roles and permissions
  - Recent boards tracking
  - Board search functionality

- **Column & Card Management**

  - Create, update, and delete columns
  - Create, update, and delete cards
  - Drag and drop functionality for cards between columns
  - Card details with descriptions and comments

- **User Management**

  - User authentication with JWT
  - User profiles with avatars
  - Recent activity tracking

- **Notifications**

  - Real-time notifications using Socket.IO
  - Email notifications for board invitations
  - Notification management system

- **Collaboration**
  - Invite members to boards
  - Member role management (Owner/Member)
  - Permission-based access control
  - Real-time updates using WebSocket

## Tech Stack

- **Runtime**: Node.js v18.16.0
- **Framework**: Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.IO
- **Email Service**: Nodemailer
- **Authentication**: JWT
- **Validation**: Joi
- **Code Quality**: ESLint
- **Build Tools**: Babel

## Project Structure

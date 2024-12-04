export const WHITELIST_DOMAINS = ['http://localhost:3000', 'https://trello-web-yv1v.vercel.app', 'https://auto-send-request.onrender.com']

export const BOARD_TYPES = { PUBLIC: 'public', PRIVATE: 'private' }

export const NOTIFICATION_TYPES = { INVITE: 'invite' }

export const NOTIFICATION_INVITATION_STATUS = { PENDING: 'pending', ACCEPTED: 'accepted', REMOVED: 'removed' }

export const NOTIFICATION_STATUS = { UNREAD: 'unread', READ: 'read' }

export const MESSAGE_TYPES = { TEXT: 'text', IMAGE: 'image' }

export const MEMBER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted'
}

export const BOARD_MEMBER_ROLE = {
  MEMBER: 'member',
  OWNER: 'owner'
}

export const DEFAULT_BOARD_PERMISSIONS = {
  viewBoard: [BOARD_MEMBER_ROLE.MEMBER, BOARD_MEMBER_ROLE.OWNER],
  editBoard: [BOARD_MEMBER_ROLE.MEMBER, BOARD_MEMBER_ROLE.OWNER],
  deleteBoard: [BOARD_MEMBER_ROLE.OWNER],
  inviteMember: [BOARD_MEMBER_ROLE.OWNER],
  deleteMember: [BOARD_MEMBER_ROLE.OWNER],
  starBoard: [BOARD_MEMBER_ROLE.MEMBER, BOARD_MEMBER_ROLE.OWNER]
}

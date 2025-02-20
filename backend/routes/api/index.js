const router = require('express').Router()
const { restoreUser, requireAuth } = require('../../utils/auth')
const sessionRouter = require('./session')
const usersRouter = require('./users')
const groupsRouter = require('./groups')
const channelRouter = require('./channel')
const channelChatRouter = require('./channel_chat')
const channelPhotosRouter = require('./channel_photos')
const channelChatReplyRouter = require('./channel_chat_reply')
const liveEventsRouter = require('./live_events')
const liveEventsAttendanceRouter = require('./live_events_attendance')

const conversationsRouter = require('./conversation')

// This was used to test require auth and setting session tokens.
// This will now be used to conect restoreUser middleware to the API router
// If current user session is valid, restoreUser will set req.user to the user in the db
// Else, it will set req.user to null

router.use(restoreUser)

router.use('/session', sessionRouter)
router.use('/users', usersRouter)

router.use(requireAuth)

router.use('/groups', groupsRouter)
router.use('/groups/:groupId/channels', channelRouter)
router.use('/groups/:groupId/channels/:channelId/channel_chat', channelChatRouter)
router.use('/groups/:groupId/channels/:channelId/channel_chat/:channelChatId/photos', channelPhotosRouter)
router.use('/groups/:groupId/channels/:channelId/channel_chat/:channelChatId/reply', channelChatReplyRouter)
router.use('/groups/:groupId/live_events', liveEventsRouter)
router.use('/groups/:groupId/live_events/:liveEventId/attendance', liveEventsAttendanceRouter)
router.use('/conversations', conversationsRouter)




module.exports = router

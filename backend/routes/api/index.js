const router = require('express').Router()
const { restoreUser, requireAuth, restoreTestUser } = require('../../utils/auth')
const sessionRouter = require('./session')
const usersRouter = require('./users')
const groupsRouter = require('./groups')
const channelRouter = require('./channel')
const channelChatRouter = require('./channel_chat')
const channelPhotosRouter = require('./channel_photos')
const channelChatReplyRouter = require('./channel_chat_reply')

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

router.post('/test', (req, res) => {
  res.json({
    requestBody: req.body
  })
})

router.get('/', (_req, res) => {
  res.json({
    message: "I'm alive"
  })
})



module.exports = router















/*
Test code

const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

const { requireAuth } = require('../../utils/auth.js');
router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);
*/

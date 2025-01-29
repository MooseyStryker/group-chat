const router = require('express').Router()
const { restoreUser } = require('../../utils/auth')

// This was used to test require auth and setting session tokens.
// This will now be used to conect restoreUser middleware to the API router
// If current user session is valid, restoreUser will set req.user to the user in the db
// Else, it will set req.user to null

router.use(restoreUser)


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

module.exports = router

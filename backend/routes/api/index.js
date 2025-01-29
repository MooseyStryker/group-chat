const router = require('express').Router()
const { restoreUser } = require('../../utils/auth')

// This was used to test require auth and setting session tokens.
// This will now be used to conect restoreUser middleware to the API router
// If current user session is valid, restoreUser will set req.user to the user in the db
// Else, it will set req.user to null
router.use(restoreUser)


module.exports = router

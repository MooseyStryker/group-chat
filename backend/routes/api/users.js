const express = require('express')
const bcrypt = require('bcryptjs')

const { setTokenCookie, requireAuth } = require('../../utils/auth')
const { User } = require('../../db/models')

const router = express.Router()

// User Signup
router.post('/', async (req,res) => {
    const { email, password, username } = req.body

    // Store the hashed password, not the actual password
    const hashedPassword = bcrypt.hashSync(password)
    const user = await User.create({
        email,
        username,
        hashedPassword
    })

    const safeUser = {
        id: user.id,
        email: user.email,
        user: user.username
    }

    await setTokenCookie(res, safeUser)

    return res.json({
        user: safeUser
    })
})


module.exports = router

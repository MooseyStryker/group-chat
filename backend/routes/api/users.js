const express = require('express')
const bcrypt = require('bcryptjs')

const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')

const { setTokenCookie, requireAuth } = require('../../utils/auth')
const { User } = require('../../db/models')

const router = express.Router()

// Validates signup information
const validateSignup = [
    check('email')
        .exists({
            checkFalsy: true
        })
        .isEmail()
        .withMessage('Please provide email'),

    check('username')
        .exists({
            checkFalsy: true
        })
        .isLength({
            min: 4
        })
        .withMessage('Please provie username with at least 4 characters'),

    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email'),

    check('password')
        .exists({
            checkFalsy: true
        })
        .isLength({
            min: 6
        })
        .withMessage("Password must be 6 characters or more"),

    handleValidationErrors
]

// User Signup
router.post('/',
    validateSignup, // Validates the info in the req body shortly after api calls
    async (req,res) => {
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

const express = require('express')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')

const { setTokenCookie, restoreUser} = require('../../utils/auth')
const { User } = require('../../db/models')

const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')

const router = express.Router()

const validateLogin = [
    check('credential')
        .exists({
            checkFalsy: true
        })
        .notEmpty()
        .withMessage('Please provide a valid email or username'),

    check(password)
        .exists({
            checkFalsy: true
        })
        .withMessage('Please provide a password'),

    handleValidationErrors
]

// User Login
router.post('/',
    validateLogin, // Validates the login in before rest of api starts 
    async (req, res, next) =>{
    const { credential, password } = req.body

    const user = await User.unscoped().findOne({
        where:{
            [Op.or]: {
                username: credential,
                email: credential
            }
        }
    })

    // Password is stored in a hash using bcrypt
    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())){
        const err = new Error('Login Failed')
        err.status = 401
        err.title = "Login failed"
        err.errors = {
            credential: 'The provided credentials were invalid.'
        }

        return next(err)
    }

    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username
    }

    await setTokenCookie(res, safeUser)

    return res.json({
        user: safeUser
    })

})


// Logout middleware
router.delete('/', (_req, res) => {
    res.clearCookie('token')
    return res.json({
        message: 'Success'
    })
})

// Restore the user's session. This will be used to allow uses to jump out of the site and back and stay logged in
router.get ('/', (req, res) => {
    // Pull user from req
    const { user } = req

    // If no user, return back to auth error handling middleware
    if(!user){
        return res.json({
            user:null
        })

    // Else return back to user session
    } else {
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username
        }

        return res.json({
            user: safeUser
        })
    }
})






module.exports = router

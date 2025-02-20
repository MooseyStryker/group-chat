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

    check('password')
        .exists({
            checkFalsy: true
        })
        .withMessage('Please provide a password'),

    handleValidationErrors
]


/**
 * @swagger
 * /api/session/:
 *   post:
 *     summary: Log in a user
 *     tags: [Session]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
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
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
    }

    await setTokenCookie(res, safeUser)

    return res.json({
        user: safeUser
    })

})

/**
 * @swagger
 * /session:
 *   delete:
 *     summary: Log out the user
 *     tags: [Session]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 */
// Logout middleware
router.delete('/', (_req, res) => {
    res.clearCookie('token')
    return res.json({
        message: 'Success'
    })
})






/**
 * @swagger
 * /session:
 *   get:
 *     summary: Restore the user's session
 *     tags: [Session]
 *     responses:
 *       200:
 *         description: User session restored
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                   example:
 *                     id: 1
 *                     firstName: John
 *                     lastName: Doe
 *                     email: john.doe@example.com
 *                     username: johndoe
 *                   description: The user's details if logged in, otherwise null
 */
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
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username
        }

        return res.json({
            user: safeUser
        })
    }
})






module.exports = router

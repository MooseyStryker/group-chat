// We pull the jwtConfig from config/index.js file which pulls the secret and expiresIn from the .env file
const jwt = require('jsonwebtoken')
const { jwtConfig } = require('../config')
const { User } = require('../db/models')

const { secret, expiresIn } = jwtConfig

const { Channel, Group, GroupMembership} = require('../db/models');



// Sends out the JWT Cookie for the browser to use
const setTokenCookie = (res, user) => {
    // This creates our JWT
    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
    };

    const token = jwt.sign(
        {
            data: safeUser
        },
        secret,
        {
            expiresIn: parseInt(expiresIn) // We use parseInt due to issues with the data being transfered from the .env file becomes a string rather than an integer
        }
    );

    const isProduction = process.env.NODE_ENV === 'production'

    // Sets our token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge uses milliseconds, expiresIn is regular seconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && 'Lax'
    });

    return token
}

const restoreUser = (req, res, next) => {
    // token that's parsed from the cookies in the browser
    const { token } = req.cookies
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next()
        }

        try {
            const { id } = jwtPayload.data
            req.user = await User.findByPk(id, {
                attributes:{
                    include: ['email', 'createdAt', 'updatedAt']
                }
            })
        } catch (error) {
            res.clearCookie('token')
            return next()
        }

        if (!req.user) res.clearCookie('token');

        return next();
    })
}

const restoreTestUser = async (req, res, next) => {
    // token that's parsed from the cookies in the browser
    req.user = await User.findByPk(1, {
        attributes:{
            include: ['email', 'createdAt', 'updatedAt']
        }
    })

    return next();
}

// To ensures the pages are secured from non-users, this will produce an error in the backend. We'll add more errors in the frontend to guide the user to signup
const requireAuth = function (req, _res, next){
    if (req.user) return next();

    const err = new Error('Authentication required')
    err.title = 'Authentication required'
    err.errors = {
        message: 'User not found, authentication required'
    }
    err.status = 401
    return next(err)
}

const requireGroupMembership = async function (req, res, next){
    const channelId = req.params.channelId

    const { user } = req

    const channel = await Channel.findByPk(channelId)

    if (!channel){
        return res.status(403).json({
            message: `Was not able to find ${(!channel) ? 'channel' : 'group'}`
        })
    }


    let group = await Group.findByPk(channel.groupId)
    group = group.dataValues

    if (!channel || !group){
        return res.status(403).json({
            message: `Was not able to find ${(!channel) ? 'channel' : 'group'}`
        })
    }


    const membership = await GroupMembership.findOne({
        where: {
            groupId: group.id,
            memberId: user.id
        }
    })

    if (!membership){
        if (group.organizerId !== user.id){
            return res.status(403).json({
             message: "Your group membership was not found"
            })
        }
    }
    return next()
}

const requireGroupMembershipFromLiveEvents = async function (req, res, next){

    const groupId = req.params.groupId
    console.log("🚀 ~ requireGroupMembershipFromLiveEvents ~ groupId:", groupId)
    const { user } = req

    let group = await Group.findByPk(groupId)

    if (!group){
        return res.status(403).json({
            message: `Was not able to find group`
        })
    }


    const membership = await GroupMembership.findOne({
        where: {
            groupId: group.id,
            memberId: user.id
        }
    })

    if (!membership){
        if (group.organizerId !== user.id){
            return res.status(403).json({
             message: "Your group membership was not found"
            })
        }
    }
    return next()
}

const isCoAdmin = async (groupId, userId) => {

    const findingCoAdmin = await GroupMembership.findOne({
        where:{
            groupId,
            memberId: userId,
            status: 'co-admin'
        }
    })

    return findingCoAdmin
}

module.exports = {
    setTokenCookie,
    restoreUser,
    requireAuth,
    restoreTestUser,
    requireGroupMembership,
    requireGroupMembershipFromLiveEvents,
    isCoAdmin
}

const express = require('express')
const { check } = require('express-validator')
const { requireGroupMembershipFromLiveEvents, isCoAdmin } = require('../../utils/auth')
const { Group, LiveEvent, AttendanceLiveEvent } = require('../../db/models')
const { handleValidationErrors } = require('../../utils/validation')
const { generateRandomSeed } = require('../../utils/seed_generator')
const router = express.Router({mergeParams: true})


router.use(requireGroupMembershipFromLiveEvents)

router.get('/', async (req, res, next) => {
    const liveEventId = req.params.liveEventId
    const { user } = req

    const attendance = await AttendanceLiveEvent.findAll({
        where:{
            liveEventId,
            userId: user.id
        }
    })

    return res.status(200).json({
        attendance: attendance
    })
})

router.post('/', async (req,res,next) => {
    
})


module.exports = router

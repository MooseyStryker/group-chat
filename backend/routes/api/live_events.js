const express = require('express')
const { check } = require('express-validator')
const { requireGroupMembershipFromLiveEvents, isCoAdmin } = require('../../utils/auth')
const { Group, LiveEvent, AttendanceLiveEvent } = require('../../db/models')
const { handleValidationErrors } = require('../../utils/validation')
const { generateRandomSeed } = require('../../utils/seed_generator')
const router = express.Router({mergeParams: true})

const validateLiveEvents = [
    check('name')
        .exists({ checkFalsy : true})
        .isLength({ max: 60 })
        .withMessage('Name must be 60 characters or less.'),
    check('description')
        .exists({ checkFalsy : true})
        .isLength({ min: 30 })
        .withMessage('Description must be longer than 50 characters.'),
    check('repeat')
        .exists({ checkFalsy : true})
        .withMessage('Repeat must be "daily", "weekly", "monthly".'),
    check('private')
        .isBoolean()
        .withMessage('Private must be a boolean.'),
        handleValidationErrors
]


router.get('/', requireGroupMembershipFromLiveEvents, async (req, res) => {
    const groupId = req.params.groupId
    const { user } = req

    const allLiveEvents = await LiveEvent.findAll({
        where:{
            groupId: groupId
        }
    })

    const adminStatus = await isCoAdmin(groupId, user.id)


    let viewableLiveEvents = []

    for (liveEvent of allLiveEvents){
        if(liveEvent.private === true && liveEvent.userId !== user.id && !adminStatus){
            continue
        }
        viewableLiveEvents.push(liveEvent)
    }

    return res.status(200).json({
        liveEvents: viewableLiveEvents
    })
})

router.get('/:liveEventId', requireGroupMembershipFromLiveEvents, async (req, res) => {
    const liveEventId = req.params.liveEventId
    const groupId = req.params.groupId
    const { user } = req


    const liveEvent = await LiveEvent.findByPk(liveEventId)

    const liveEventAttendance = await AttendanceLiveEvent.findOne({
        where:{
            liveEventId,
            userId: user.id
        }
    })

    if (!liveEventAttendance && liveEvent.userId !== user.id){
        res.status(404).json({
            message: 'Your attendance to this live event was not found'
        })
    }

    res.status(200).json({
        liveEvent: liveEvent
    })
})


router.post('/', requireGroupMembershipFromLiveEvents, validateLiveEvents, async (req, res) => {
    const { name, description, repeat, private } = req.body
    const groupId = req.params.groupId
    const { user } = req

    const seedData = generateRandomSeed()
    console.log("🚀 ~ router.post ~ seedData:", seedData)

    const safeLiveEvents = await LiveEvent.create({
        userId: user.id,
        groupId,
        name,
        description,
        repeat,
        private,
        privateInvitation: generateRandomSeed()
    })

    return res.status(201).json({
        liveEvent: safeLiveEvents
    })

})



router.put('/:liveEventId', requireGroupMembershipFromLiveEvents, validateLiveEvents, async (req, res) => {
    const liveEventId = req.params.liveEventId
    const groupId = req.params.groupId
    const { user } = req

    const liveEvent = await LiveEvent.findByPk(liveEventId)
    if (!liveEvent){
        res.status(404).json({
            message: 'Live event was not found'
        })
    }

    const coAdminStatus = await isCoAdmin(groupId, user.id)

    if(liveEvent.userId !== user.id && !coAdminStatus){
        res.status(403).json({
            message: 'You do not have permission to edit this live event'
        })
    }



    const { name, description, repeat, private } = req.body
    const validRepeat = ['daily', 'weekly', 'monthly']

    liveEvent.name = name !== undefined ? name : liveEvent.name
    liveEvent.description = description !== undefined ? description : liveEvent.description
    liveEvent.repeat = validRepeat.includes(repeat) ? repeat : liveEvent.repeat
    liveEvent.private = private !== undefined ? private : liveEvent.private

    res.status(201).json({
        liveEvent: liveEvent
    })
})

router.delete('/:liveEventId', requireGroupMembershipFromLiveEvents, validateLiveEvents, async (req, res) => {
    const liveEventId = req.params.liveEventId
    const groupId = req.params.groupId
    const { user } = req

    const adminStatus = isCoAdmin(groupId, user.id)

    const liveEvent = await LiveEvent.findByPk(liveEventId)

    if (liveEvent.userId !== user.id && !adminStatus){
        res.status(401).json({
            forbidden: 'You do not have permission to delete this live event'
        })
    }

    liveEvent.destroy()

    res.status(200).json({
        message: 'Successfully deleted.'
    })


})

module.exports = router

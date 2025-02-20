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

router.use(requireGroupMembershipFromLiveEvents)



// Gets all live events for a group
/**
 * @swagger
 * /groups/{groupId}/live_events:
 *   get:
 *     summary: Get all live events for a group
 *     tags: [Live Events]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group
 *     responses:
 *       200:
 *         description: A list of live events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liveEvents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       userId:
 *                         type: integer
 *                       groupId:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       repeat:
 *                         type: string
 *                       private:
 *                         type: boolean
 *                       privateInvitation:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res,next) => {
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




// Gets a single live event by ID
/**
 * @swagger
 * /groups/{groupId}/live_events/{liveEventId}:
 *   get:
 *     summary: Get a single live event by ID
 *     tags: [Live Events]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group
 *       - in: path
 *         name: liveEventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the live event
 *     responses:
 *       200:
 *         description: A single live event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liveEvent:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     groupId:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     repeat:
 *                       type: string
 *                     private:
 *                       type: boolean
 *                     privateInvitation:
 *                       type: string
 *       404:
 *         description: Attendance not found
 *       500:
 *         description: Internal server error
 */
router.get('/:liveEventId', async (req, res,next) => {
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





// Creates a new live event
/**
 * @swagger
 * /groups/{groupId}/live_events:
 *   post:
 *     summary: Create a new live event
 *     tags: [Live Events]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               repeat:
 *                 type: string
 *               private:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Successfully created a new live event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liveEvent:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     groupId:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     repeat:
 *                       type: string
 *                     private:
 *                       type: boolean
 *                     privateInvitation:
 *                       type: string
 *       500:
 *         description: Internal server error
 */
router.post('/', validateLiveEvents, async (req, res,next) => {
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




// Edits a live event by ID
/**
 * @swagger
 * /groups/{groupId}/live_events/{liveEventId}:
 *   put:
 *     summary: Edit a live event by ID
 *     tags: [Live Events]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group
 *       - in: path
 *         name: liveEventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the live event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               repeat:
 *                 type: string
 *               private:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Successfully updated the live event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liveEvent:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     groupId:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     repeat:
 *                       type: string
 *                     private:
 *                       type: boolean
 *       403:
 *         description: Forbidden. You do not have permission to edit this live event
 *       404:
 *         description: Live event not found
 *       500:
 *         description: Internal server error
 */
router.put('/:liveEventId', validateLiveEvents, async (req, res,next) => {
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





// Deletes a Live event by ID
/**
 * @swagger
 * /groups/{groupId}/live_events/{liveEventId}:
 *   delete:
 *     summary: Delete a live event by ID
 *     tags: [Live Events]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group
 *       - in: path
 *         name: liveEventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the live event
 *     responses:
 *       200:
 *         description: Successfully deleted the live event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully deleted.
 *       401:
 *         description: Unauthorized. You do not have permission to delete this live event
 *       500:
 *         description: Internal server error
 */
router.delete('/:liveEventId', validateLiveEvents, async (req, res,next) => {
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

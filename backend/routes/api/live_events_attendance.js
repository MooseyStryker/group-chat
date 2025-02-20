const express = require('express')
const { check } = require('express-validator')
const { requireGroupMembershipFromLiveEvents, isCoAdmin } = require('../../utils/auth')
const { Group, LiveEvent, AttendanceLiveEvent } = require('../../db/models')
const { generateRandomSeed } = require('../../utils/seed_generator')
const router = express.Router({mergeParams: true})

router.use(requireGroupMembershipFromLiveEvents)





// Get attendance for a live event
/**
 * @swagger
 * /groups/{groupId}/live_events/{liveEventId}/attendance:
 *   get:
 *     summary: Get attendance for a live event
 *     tags: [Attendance]
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
 *         description: A list of attendances
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 attendances:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       liveEventId:
 *                         type: integer
 *                       userId:
 *                         type: integer
 *                       invitationForPrivateLiveEvents:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res, next) => {
    const liveEventId = req.params.liveEventId
    const groupId = req.params.groupId
    const { user } = req

    const group = await Group.findByPk(groupId)

    const attendances = await AttendanceLiveEvent.findAll({
        where: {
            liveEventId,
        }
    })

    res.status(200).json({
        attendances: attendances
    })
})



// Add attendace for a Live Event
/**
 * @swagger
 * /groups/{groupId}/live_events/{liveEventId}/attendance:
 *   post:
 *     summary: Add attendance for a live event
 *     tags: [Attendance]
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
 *               invitedUserId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Successfully added attendance for the live event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 attendance:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     liveEventId:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     invitationForPrivateLiveEvents:
 *                       type: string
 *       401:
 *         description: Unauthorized. You are already on the attendance for this live event
 *       403:
 *         description: Forbidden. This event is private, you cannot join unless invited by the live event organizer
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req,res,next) => {
    const liveEventId = req.params.liveEventId
    const groupId = req.params.groupId
    const { user } = req

    const liveEvent = await LiveEvent.findByPk(liveEventId)

    const attendance = await AttendanceLiveEvent.findOne({
        where: {
            liveEventId,
            userId: user.id
        }
    })
    if (attendance) {
        return res.status(401).json({
            message: 'You are already on the attendance for this live event'
        })
    }

    const coAdminStatus = isCoAdmin(groupId, user.id)

    if (liveEvent.private) {
        if (liveEvent.userId === user.id || coAdminStatus) {
            const { invitedUserId } = req.body;

            const safeAttendanceInvite = await AttendanceLiveEvent.create({
                userId: invitedUserId,
                liveEventId,
                invitationForPrivateLiveEvents: liveEvent.privateInvitation
            });

            return res.status(201).json({
                attendance: safeAttendanceInvite
            });

        } else {
            return res.status(401).json({
                forbidden: 'This event is private, you cannot join unless invited by live event organizer'
            });
        }
    }


    const safeAttendance = await AttendanceLiveEvent.create({
        userId: user.id,
        liveEventId,
        invitationForPrivateLiveEvents: liveEvent.privateInvitation
    })

    res.json(201).json({
        attendance: safeAttendance
    })

})



// Deletes attendance for a Live Event
/**
 * @swagger
 * /groups/{groupId}/live_events/{liveEventId}/attendance/{attendanceId}:
 *   delete:
 *     summary: Delete attendance for a live event
 *     tags: [Attendance]
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
 *       - in: path
 *         name: attendanceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the attendance
 *     responses:
 *       200:
 *         description: Successfully deleted attendance for the live event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Attendance successfully deleted
 *       401:
 *         description: Unauthorized. You don't have permissions to delete this attendance
 *       404:
 *         description: Not Found. Your attendance was not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:attendanceId', async (req,res,next) => {
    const attendanceId = req.params.attendanceId
    const liveEventId = req.params.liveEventId
    const { user } = req

    const liveEvent = await LiveEvent.findByPk(liveEventId)
    const attendance = await AttendanceLiveEvent.findByPk(attendanceId)

    if (!attendance){
        res.status(404).json({
            notFound: "Your attendance was not found"
        })
    }


    if (attendance.userId !== user.id && user.id !== liveEvent.userId){
        res.status(401).json({
            forbidden: "You don't have permissions to delete this attendance"
        })
    }

    await attendance.destroy()

    res.status(200).json({
        message: 'Attendance successfully deleted'
    })


})

module.exports = router

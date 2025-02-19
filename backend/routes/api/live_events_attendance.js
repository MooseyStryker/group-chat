const express = require('express')
const { check } = require('express-validator')
const { requireGroupMembershipFromLiveEvents, isCoAdmin } = require('../../utils/auth')
const { Group, LiveEvent, AttendanceLiveEvent } = require('../../db/models')
const { generateRandomSeed } = require('../../utils/seed_generator')
const router = express.Router({mergeParams: true})

router.use(requireGroupMembershipFromLiveEvents)

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

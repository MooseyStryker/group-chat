// const express = require('express')
// const { Op } = require('sequelize')

// const { requireAuth } = require('../../utils/auth')

// const { ChannelChat, Channel, Group } = require('../../db/models')

// router.get('groups/:groupId/channel/:channelId/channel_chat', requireAuth, async (req,res,next) => {
//     const channelId = req.params.channelId
//     const groupId = req.params.groupId

//     const { User } = req

//     const group = await Group.findByPk(groupId)

//     const groupMembership = await groupMembership.findOne({
//         where: {
//             groupId: groupId,
//             memberId: User.id
//         }
//     })

//     if (group.organizerId !== User.id && !groupMembership){

//     }


//     const allChannelChat = await ChannelChat.findAll({
//         where: {
//             [Op.or]: [
//                 {
//                     channelId: channelId
//                 }
//             ]
//         }
//     })
// })



// module.exports = router

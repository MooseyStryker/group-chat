const express = require('express')
const router = express.Router({ mergeParams: true })
const { Channel, Group, ChannelChat } = require('../../db/models');
const { requireGroupMembership } = require('../../utils/auth');





// Get all the channel chats for a channel
router.get('/', requireGroupMembership, async (req, res, next) => {
    const channelId = req.params.channelId

    const channel = await Channel.findByPk(channelId)

    let group = await Group.findByPk(channel.groupId)
    group = group.dataValues

    const channelChat = await ChannelChat.findAll({
        where:{
            channelId: channelId
        }
    })

    return res.json({
        channel_chat: channelChat
    })
})



// Posts a new channel chat
router.post('/', requireGroupMembership, async (req, res, next) => {
    const { body } = req.body
    if (body.length === 0) {
        res.status(400).json({
            message: "Body cannot be empty"
        })
        return next()
    }
    const channelId = req.params.channelId

    const { user } = req

    let channel = await Channel.findByPk(channelId)
    channel = channel.dataValues
    if (!channel){
        res.status(404).json({
            message: "Channel was not found"
        })
        return next()
    }


    let group = await Group.findByPk(channel.groupId)
    group = group.dataValues


    const newChat = await ChannelChat.create({
        userId: user.id,
        channelId: channel.id,
        body,
        visible: true,
        isEdited: false
    })

    return res.status(201).json(newChat)

})

// Edits the user's channel chat
router.put('/:channelChatId', requireGroupMembership, async (req, res, next) => {
    const channelChatId = req.params.channelChatId
    const { user } = req

    const { body, visible } = req.body

    const channelId = req.params.channelId

    const channelChat = await ChannelChat.findByPk(channelChatId)
    const findChannel = await Channel.findByPk(channelId)


    if (!findChannel || !channelChat){
        res.status(403).json({
            message: `Was not able to find ${(!findChannel) ? 'channel' : 'channel chat'} info for you`
        })
    }

    if(user.id !== channelChat.userId){
        res.status(403).json({
            message: "You don't have permission to edit this chat message"
        })
    }

    channelChat.body = body !== undefined ? body : channelChat.body
    channelChat.visible = visible !== undefined ? true : false
    channelChat.isEdited = true

    await channelChat.save()

    return res.status(201).json(channelChat)

})

router.delete('/:channelId/channel_chat/:channelChatID', requireGroupMembership, async (req,res, next) =>{
    const channelChatId = req.params.channelChatID
    const { user } = req

    const channelId = req.params.channelId

    const channelChat = await ChannelChat.findByPk(channelChatId)
    const findChannel = await Channel.findByPk(channelId)


    if (!findChannel || !channelChat){
        res.status(403).json({
            message: `Was not able to find ${(!findChannel) ? 'channel' : 'channel chat'} info for you`
        })
    }

    if(user.id !== channelChat.userId){
        res.status(403).json({
            message: "You don't have permission to edit this chat message"
        })
    }

    await channelChat.destroy()

    return res.status(200).json({
        message: "Successfully deleted chat from channel"
    })
})



module.exports = router;

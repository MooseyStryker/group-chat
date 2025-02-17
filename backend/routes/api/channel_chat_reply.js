const express = require('express')
const { requireGroupMembership } = require('../../utils/auth')
const { ChannelChatReply, Group, GroupMembership } = require('../../db/models')
const { group } = require('console')

const router = express.Router({ mergeParams: true })

router.get('/', requireGroupMembership, async (req, res) =>{
    const channelChatId = req.params.channelChatId
    const { user } = req
    const allReplies = await ChannelChatReply.findAll({
        where: {
            channelChatId: channelChatId,
        }
    })

    let replies = []

    for (reply of allReplies){
        if (reply.visible === false && reply.userId !== user.id){
            continue
        }

        replies.push(reply)
    }

    return res.status(201).json({
        channelChatReplies: replies
    })
})

router.post('/', requireGroupMembership, async (req, res) => {
    const channelChatId = req.params.channelChatId
    const { user } = req
    const { body } = req.body

    if (body.length === 0){
        res.status(400).json({
            message: 'Body cannot be empty'
        })
    }

    const newReply = await ChannelChatReply.create({
        channelChatId,
        userId: user.id,
        body,
        isEdited: false,
        visible: true
    })

    return res.status(201).json({
        reply: newReply
    })
})

router.put('/:channelChatReplyId', requireGroupMembership, async (req, res) => {
    const channelChatReplyId = req.params.channelChatReplyId
    const { user } = req

    const reply = await ChannelChatReply.findByPk(channelChatReplyId)

    if(reply.userId !== user.id){
        return res.status(403).json({
            message: "You don't have permission to edit this reply"
        })
    }

    const { body, isEdited } = req.body

    reply.body = body !== undefined ? body : reply.body
    reply.isEdited = true

    await reply.save()

    return res.status(201).json({
        reply: reply
    })
})

router.delete('/:channelChatReplyId', requireGroupMembership, async (req,res) =>{
    const channelChatReplyId = req.params.channelChatReplyId
    const groupId = req.params.groupId

    const { user } = req

    const group = await Group.findByPk(groupId)
    const reply = await ChannelChatReply.findByPk(channelChatReplyId)
    const isCoAdmin = await GroupMembership.findOne({
        where:{
            memberId: user.id,
            groupId: groupId,
            status: 'co-admin'
        }
    })

    if(reply.userId !== user.id && group.userId !== user.id){
        return res.status(403).json({
            message: "You don't have permission to delete this reply"
        })
    }

    return res.status(201).json({
        message: 'Reply successfully deleted'
    })
})

module.exports = router

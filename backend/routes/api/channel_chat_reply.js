const express = require('express')
const { requireGroupMembership } = require('../../utils/auth')
const { ChannelChatReply, Group, GroupMembership } = require('../../db/models')
const { group } = require('console')

const router = express.Router({ mergeParams: true })



// Gets all the replies to a single channel chat
/**
 * @swagger
 * /groups/{groupId}/channels/{channelId}/channel_chat/{channelChatId}/reply:
 *   get:
 *     summary: Get all the replies to a single channel chat
 *     tags: [Channel Chat Replies]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the channel
 *       - in: path
 *         name: channelChatId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the channel chat
 *     responses:
 *       201:
 *         description: A list of channel chat replies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 channelChatReplies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       channelChatId:
 *                         type: integer
 *                       userId:
 *                         type: integer
 *                       body:
 *                         type: string
 *                       isEdited:
 *                         type: boolean
 *                       visible:
 *                         type: boolean
 *       404:
 *         description: Channel chat not found
 *       500:
 *         description: Internal server error
 */
router.get('/', requireGroupMembership, async (req, res) => {
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





// Adds a reply to a channel chat
/**
 * @swagger
 * /groups/{groupId}/channels/{channelId}/channel_chat/{channelChatId}/reply:
 *   post:
 *     summary: Add a reply to a channel chat
 *     tags: [Channel Chat Replies]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the channel
 *       - in: path
 *         name: channelChatId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the channel chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully added a reply
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     channelChatId:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     body:
 *                       type: string
 *                     isEdited:
 *                       type: boolean
 *                     visible:
 *                       type: boolean
 *       400:
 *         description: Body cannot be empty
 *       500:
 *         description: Internal server error
 */
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





// Edits the user's reply
/**
 * @swagger
 * /groups/{groupId}/channels/{channelId}/channel_chat/{channelChatId}/reply/{channelChatReplyId}:
 *   put:
 *     summary: Edit a user's reply
 *     tags: [Channel Chat Replies]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the channel
 *       - in: path
 *         name: channelChatId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the channel chat
 *       - in: path
 *         name: channelChatReplyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the channel chat reply
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully edited the reply
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     channelChatId:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     body:
 *                       type: string
 *                     isEdited:
 *                       type: boolean
 *                     visible:
 *                       type: boolean
 *       403:
 *         description: You don't have permission to edit this reply
 *       500:
 *         description: Internal server error
 */
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




// Deletes a user's reply
/**
 * @swagger
 * /groups/{groupId}/channels/{channelId}/channel_chat/{channelChatId}/reply/{channelChatReplyId}:
 *   delete:
 *     summary: Delete a user's reply
 *     tags: [Channel Chat Replies]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group
 *       - in: path
 *         name: channelId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the channel
 *       - in: path
 *         name: channelChatId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the channel chat
 *       - in: path
 *         name: channelChatReplyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the channel chat reply
 *     responses:
 *       201:
 *         description: Reply successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: You don't have permission to delete this reply
 *       404:
 *         description: Reply not found
 *       500:
 *         description: Internal server error
 */
// Deletes a user's reply
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

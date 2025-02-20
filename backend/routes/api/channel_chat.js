const express = require('express')
const router = express.Router({ mergeParams: true })
const { Channel, Group, ChannelChat } = require('../../db/models');
const { requireGroupMembership } = require('../../utils/auth');


router.use(requireGroupMembership)


/**
 * @swagger
 * /api/groups/{groupId}/channels/{channelId}/channel_chat:
 *   get:
 *     summary: Get all the channel chats for a channel
 *     tags: [Channel Chats]
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
 *     responses:
 *       200:
 *         description: A list of channel chats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 channel_chat:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       userId:
 *                         type: integer
 *                       channelId:
 *                         type: integer
 *                       body:
 *                         type: string
 *                       visible:
 *                         type: boolean
 *                       isEdited:
 *                         type: boolean
 *       404:
 *         description: Channel not found
 */
// Get all the channel chats for a channel
router.get('/', async (req, res, next) => {
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



/**
 * @swagger
 * /api/groups/{groupId}/channels/{channelId}/channel_chat:
 *   post:
 *     summary: Post a new channel chat
 *     tags: [Channel Chats]
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
 *         description: Channel chat created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 channelId:
 *                   type: integer
 *                 body:
 *                   type: string
 *                 visible:
 *                   type: boolean
 *                 isEdited:
 *                   type: boolean
 *       400:
 *         description: Body cannot be empty
 *       404:
 *         description: Channel not found
 */
// Posts a new channel chat
router.post('/', async (req, res, next) => {
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



/**
 * @swagger
 * /api/groups/{groupId}/channels/{channelId}/channel_chat/{channelChatId}:
 *   put:
 *     summary: Edit a user's channel chat
 *     tags: [Channel Chats]
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
 *               visible:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Channel chat updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 userId:
 *                   type: integer
 *                 channelId:
 *                   type: integer
 *                 body:
 *                   type: string
 *                 visible:
 *                   type: boolean
 *                 isEdited:
 *                   type: boolean
 *       403:
 *         description: Permission denied or channel/chat not found
 */
// Edits the user's channel chat
router.put('/:channelChatId', async (req, res, next) => {
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



/**
 * @swagger
 * /api/groups/{groupId}/channels/{channelId}/channel_chat/{channelChatID}:
 *   delete:
 *     summary: Delete a user's chat in a channel chat
 *     tags: [Channel Chats]
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
 *         name: channelChatID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the channel chat
 *     responses:
 *       200:
 *         description: Successfully deleted chat from channel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully deleted chat from channel
 *       403:
 *         description: Permission denied or channel/chat not found
 */
// Deletes a user's chat in a channel chat
router.delete('/:channelId/channel_chat/:channelChatID', async (req,res, next) =>{
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

const express = require('express')
const { body } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');
const { Channel, Group, GroupMembership, ChannelChat } = require('../../db/models');
const { requireGroupMembership } = require('../../utils/auth');

const router = express.Router({ mergeParams: true })




/* Channel */
router.get(
    '/',
    async (req, res) => {
        const groupId = parseInt(req.params.groupId);
        const userId = req.user.id;

        const group = await Group.findByPk(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group couldn't be found" });
        }

        let allowed = group.dataValues.organizerId == userId;

        if (!allowed) {
            const membership = await GroupMembership.findOne({
                where: {
                    group_id: groupId,
                    user_id: userId,
                    status: { [Sequelize.Op.in]: ['member', 'co-admin'] },
                },
            });

            allowed = membership && (membership.dataValues.status == "member" || membership.dataValues.status == 'co-admin'); // Check if membership exists
        }

        if (!allowed) {
            return res.status(403).json({ message: "Forbidden" });
        }


        const channels = await Channel.findAll({
            where: { groupId: groupId },
            attributes: ['id', 'groupId', 'channelCreatorId', 'channelName', 'channelType', 'private'], // Specify attributes for efficiency
        });

        const safeChannels = channels.map(channel => ({
            id: channel.id,
            groupId: channel.groupId,
            channel_creator_id: channel.channelCreatorId,
            channel_name: channel.channelName,
            channel_type: channel.channelType,
            private: channel.private,
        }));

        return res.status(200).json({ channels: safeChannels });
    }
);

router.post(
    '/',
    [
        body('channel_name').notEmpty().withMessage('Channel name is required'),
        body('channel_type').notEmpty().withMessage('Channel type is required'),
        body('private').isBoolean().withMessage('Private mode must be true or false'),
        handleValidationErrors
    ],
    async (req, res) => {
        const { channel_name, channel_type, private } = req.body;
        const groupId = parseInt(req.params.groupId);

        const userId = req.user.id; // Now safe to access req.user.id

        const group = await Group.findByPk(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group couldn't be found" });
        }

        let allowed = group.dataValues.organizerId == userId

        if (!allowed) {
            const membership = await GroupMembership.findOne({
                where: {
                    group_id: groupId,
                    user_id: userId,
                    status: { [Sequelize.Op.in]: ['member', 'co-admin'] }, // Check for 'member' or 'co-admin'
                },
            });

            allowed = membership && membership.dataValues.status == "member" || membership.dataValues.status == 'co-admin';
        }

        if (!allowed) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const newChannel = await Channel.create({
            channelName: channel_name,
            channelType: channel_type,
            groupId: groupId,
            private: private,
            channelCreatorId: userId,
        })

        const safeChannel = {
            id: newChannel.dataValues.id, // Simple ID generation (replace with your database's ID generation)
            groupId: newChannel.dataValues.groupId,
            channel_creator_id: newChannel.dataValues.channelCreatorId,
            channel_name: newChannel.dataValues.channelName,
            channel_type: newChannel.dataValues.channelType,
            private: newChannel.dataValues.private,
        };


        return res.status(200).json(safeChannel);
    }
);

router.put(
    '/:channelId',
    [
        body('channel_name').optional().notEmpty().withMessage('Channel name is required'), // Make optional for updates
        body('private').optional().isBoolean().withMessage('Private mode must be true or false'), // Make optional
        handleValidationErrors,
    ],
    async (req, res) => {
        const channelId = parseInt(req.params.channelId);
        const userId = req.user.id;
        const { channel_name, private } = req.body;

        const channel = await Channel.findByPk(channelId, { include: { model: Group } }); // Include Group for easy access

        if (!channel) {
            return res.status(404).json({ message: "channel couldn't be found" });
        }

        const groupId = channel.Group.id; // Access groupId through the included Group model

        let allowed = channel.channelCreatorId === userId; // Check if user created the channel

        if (!allowed) {
            const group = await Group.findByPk(groupId); //Need to find the group to verify permissions
            if (!group) {
                return res.status(404).json({ message: "Group couldn't be found" });
            }
            allowed = group.organizerId === userId; //Check if user is the organizer

            if (!allowed) {
                const membership = await GroupMembership.findOne({
                    where: {
                        group_id: groupId,
                        user_id: userId,
                        status: 'co-admin',
                    },
                });

                allowed = !!membership; // Check if membership exists and is co-admin
            }
        }

        if (!allowed) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Update the channel
        if (channel_name !== undefined) channel.channelName = channel_name;
        if (private !== undefined) channel.private = private;
        await channel.save();


        const safeChannel = {
            id: channel.id,
            groupId: channel.groupId,
            channel_creator_id: channel.channelCreatorId,
            channel_name: channel.channelName,
            channel_type: channel.channelType,
            private: channel.private,
        };

        return res.status(200).json(safeChannel);
    }
);

router.delete(
    '/:channelId',
    async (req, res) => {
        const channelId = parseInt(req.params.channelId);
        const userId = req.user.id;

        const channel = await Channel.findByPk(channelId, { include: { model: Group } });

        if (!channel) {
            return res.status(404).json({ message: "Channel couldn't be found" });
        }

        const groupId = channel.Group.id;

        let allowed = channel.channelCreatorId === userId; // Check if user created the channel

        if (!allowed) {
            const group = await Group.findByPk(groupId);
            if (!group) {
                return res.status(404).json({ message: "Group couldn't be found" });
            }
            allowed = group.organizerId === userId; // Check if user is the organizer

            if (!allowed) {
                const membership = await GroupMembership.findOne({
                    where: {
                        group_id: groupId,
                        user_id: userId,
                        status: 'co-admin',
                    },
                });

                allowed = !!membership; // Check if membership exists and is co-admin
            }
        }

        if (!allowed) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await channel.destroy(); // Delete the channel

        return res.status(200).json({ message: "Successfully deleted" });
    }
);







/* Channel Chat */

// Get all the channel chats for a channel
router.get('/:channelId/channel_chat', requireGroupMembership, async (req, res, next) => {
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
router.post('/:channelId/channel_chat', requireGroupMembership, async (req, res, next) => {
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
router.put('/:channelId/channel_chat/:channelChatID', requireGroupMembership, async (req, res, next) => {
    const channelChatId = req.params.channelChatID
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

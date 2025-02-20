const express = require('express')
const { body } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');
const { Channel, Group, GroupMembership, ChannelChat } = require('../../db/models');

const router = express.Router({ mergeParams: true })



/**
 * @swagger
 * /api/{groupId}/channels:
 *   get:
 *     summary: Get all channels in a group
 *     tags: [Channels]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group
 *     responses:
 *       200:
 *         description: A list of channels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 channels:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       groupId:
 *                         type: integer
 *                       channelCreatorId:
 *                         type: integer
 *                       channelName:
 *                         type: string
 *                       channelType:
 *                         type: string
 *                       private:
 *                         type: boolean
 *       404:
 *         description: Group not found
 *       403:
 *         description: Forbidden
 */
// Get all Channels in a group
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
            channelCreatorId: channel.channelCreatorId,
            channelName: channel.channelName,
            channelType: channel.channelType,
            private: channel.private,
        }));

        return res.status(200).json({ channels: safeChannels });
    }
);


/**
 * @swagger
 * /api/{groupId}/channels:
 *   post:
 *     summary: Create a new channel in a group
 *     tags: [Channels]
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
 *               channelName:
 *                 type: string
 *               channelType:
 *                 type: string
 *               private:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Channel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 groupId:
 *                   type: integer
 *                 channelCreatorId:
 *                   type: integer
 *                 channelName:
 *                   type: string
 *                 channelType:
 *                   type: string
 *                 private:
 *                   type: boolean
 *       404:
 *         description: Group not found
 *       403:
 *         description: Forbidden
 */
// Creates a new channel in a group
router.post(
    '/',
    [
        body('channel_name').notEmpty().withMessage('Channel name is required'),
        body('channel_type').notEmpty().withMessage('Channel type is required'),
        body('private').isBoolean().withMessage('Private mode must be true or false'),
        handleValidationErrors
    ],
    async (req, res) => {
        const { channelName, channelType, private } = req.body;
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
                    groupId: groupId,
                    userId: userId,
                    status: { [Sequelize.Op.in]: ['member', 'co-admin'] }, // Check for 'member' or 'co-admin'
                },
            });

            allowed = membership && membership.dataValues.status == "member" || membership.dataValues.status == 'co-admin';
        }

        if (!allowed) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const newChannel = await Channel.create({
            channelName: channelName,
            channelType: channelType,
            groupId: groupId,
            private: private,
            channelCreatorId: userId,
        })

        const safeChannel = {
            id: newChannel.dataValues.id, // Simple ID generation (replace with your database's ID generation)
            groupId: newChannel.dataValues.groupId,
            channelCreatorId: newChannel.dataValues.channelCreatorId,
            channelName: newChannel.dataValues.channelName,
            channelType: newChannel.dataValues.channelType,
            private: newChannel.dataValues.private,
        };


        return res.status(200).json(safeChannel);
    }
);


/**
 * @swagger
 * /api/{groupId}/channels/{channelId}:
 *   put:
 *     summary: Edit a channel in a group
 *     tags: [Channels]
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
 *               channelName:
 *                 type: string
 *               private:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Channel updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 groupId:
 *                   type: integer
 *                 channelCreatorId:
 *                   type: integer
 *                 channelName:
 *                   type: string
 *                 channelType:
 *                   type: string
 *                 private:
 *                   type: boolean
 *       404:
 *         description: Channel or group not found
 *       403:
 *         description: Forbidden
 */
// Edits a channel in a group
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
                        groupId: groupId,
                        userId: userId,
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
            channelCreatorId: channel.channelCreatorId,
            channelName: channel.channelName,
            channelType: channel.channelType,
            private: channel.private,
        };

        return res.status(200).json(safeChannel);
    }
);



/**
 * @swagger
 * /api/{groupId}/channels/{channelId}:
 *   delete:
 *     summary: Delete a channel in a group
 *     tags: [Channels]
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
 *         description: Successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Successfully deleted
 *       404:
 *         description: Channel or group not found
 *       403:
 *         description: Forbidden
 */
// Deletes a channel in a group
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
                        groupId: groupId,
                        userId: userId,
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


module.exports = router;

const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Group, User, GroupMembership, Channel, } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { generateRandomSeed } = require('../../utils/seed_generator')
const { Op } = require('sequelize')

const router = express.Router();

// Validation middleware for creating and editing groups
const validateGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 60 })
        .withMessage('Name must be 60 characters or less'),
    check('description')
        .exists({ checkFalsy: true })
        .isLength({ min: 50 })
        .withMessage('Description must be 50 characters or more'),
    check('private')
        .isBoolean()
        .withMessage('Private must be a boolean'),
    handleValidationErrors
];

// Validation middleware for changing membership status
const validateMembershipStatus = [
    check('memberId')
        .exists({ checkFalsy: true })
        .withMessage('Member id is required!'),
    check('status') // Make sure status exists and is valid
        .exists({ checkFalsy: true })
        .withMessage('Status is required!')
        .isIn(['pending', 'member', 'co-admin'])
        .withMessage('Status is invalid!')
        .not().matches('pending')
        .withMessage('Cannot change a membership status to pending!'),
    handleValidationErrors
]



/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Get all groups
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: A list of groups
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Groups:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       private:
 *                         type: boolean
 *                       membership:
 *                         type: object
 *                         nullable: true
 */
// Get all groups
router.get('/', async (req, res) => {
    // In the case that they are a member, they can access all groups, including private ones
    const groups = await Group.findAll();
    const { user } = req

    let groupList = []


    // We look at each group to find the user's membership
    // Also we check to see if there is a privated group where the user does not have a membership
    for (group of groups){
        const groupId = parseInt(group.id)
        const isGroupMemeber = await GroupMembership.findOne({
            where: {
                memberId: user.id,
                groupId: groupId
            }
        })

        // If group membership found, push immediately
        // Spread group.dataValues due to it being a nested object, same with isGroupMember
        // This allows us to see which group is the user a member
        if (isGroupMemeber){
            groupList.push({...group.dataValues, membership: {...isGroupMemeber.dataValues}})
        }

        // If no membership found, and the group is not privated, push
        if (!isGroupMemeber && group.private === false){
            groupList.push(group)
        }

    }


    return res.json({ Groups: groupList });
});



/**
 * @swagger
 * /api/groups/current:
 *   get:
 *     summary: Get all groups joined or organized by the current user
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: A list of groups
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Groups:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       private:
 *                         type: boolean
 *                       membership:
 *                         type: object
 *                         nullable: true
 */
// Get all groups joined or organized by the current user
router.get('/current', async (req, res) => {
    const userId = req.user.id;
    console.log(userId);
    const groups = await Group.findAll({
        include: [
            {
                model: GroupMembership,
                where: {
                    memberId: userId
                }
            }
        ],
        where: {
            [Op.or]:[
                {'$organizerId$': userId},
                {'$GroupMemberships.memberId$': userId},
            ]
        }
    });
    return res.json({ Groups: groups });
});



/**
 * @swagger
 * /api/groups/{groupId}:
 *   get:
 *     summary: Get details of a group by id
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group
 *     responses:
 *       200:
 *         description: Group details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 private:
 *                   type: boolean
 *                 Organizer:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                 Channels:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *       404:
 *         description: Group not found
 *       403:
 *         description: Unauthorized access
 */
// Get details of a group from an id
router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId, {
        include: [
            { model: User, as: 'Organizer' },
            { model: Channel }
        ]
    });

    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }

    if (group.private) {
        const { user } = req;

        const membership = await GroupMembership.findOne({
            where: {
                groupId: group.id,
                memberId: user.id
            }
        });

        if (!membership || group.organizerId !== user.id) {
            return res.status(403).json({
                message: "Your membership was not found or you are not the group's organizer"
            })
        }
    }

    return res.json(group);
});



/**
 * @swagger
 * /api/groups/{groupId}/members:
 *   get:
 *     summary: Get members of a group by group id
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group
 *     responses:
 *       200:
 *         description: A list of group members
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       firstname:
 *                         type: string
 *                       lastname:
 *                         type: string
 *                       Membership:
 *                         type: object
 *                         properties:
 *                           status:
 *                             type: string
 *                             enum: [pending, member, co-admin]
 *       404:
 *         description: Group not found
 */
// Get members of a group by group id
router.get('/:groupId/members', async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId, {
        include: [
            { model: User, as: 'Organizer' }
        ]
    });

    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }

    const { user } = req;

    // if user is NOT organizer, do NOT select users with pending membership
    const filterStatus = {};
    if (user.id !== group.organizerId) {
        filterStatus.status = {
            [Op.not]: 'pending'
        };
    }

    const memberships = await GroupMembership.findAll({
        include: [
            { model: User, attributes: ['firstName', 'lastName'] }
        ],
        where: {
            groupId,
            ...filterStatus // include additional filtering
        },
        attributes: ['memberId', 'status']
    });

    const membersList = memberships.map(membership => ({
        id: membership.memberId,
        firstname: membership.User.firstName,
        lastname: membership.User.lastName,
        Membership: {
            status: membership.status
        }
    }));

    return res.json({ Members: membersList });
});



/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
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
 *               private:
 *                 type: boolean
 *               img_AWS_link:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 private:
 *                   type: boolean
 *                 img_AWS_link:
 *                   type: string
 */
// Create a group
router.post('/', validateGroup, async (req, res) => {
    const { name, description, private, img_AWS_link } = req.body;
    const organizerId = req.user.id;

    const seed = generateRandomSeed()
    console.log("🚀 ~ router.post ~ seed:", seed)


    const group = await Group.create({
        name,
        description,
        private,
        groupInvitation: generateRandomSeed(),
        img_AWS_link,
        organizerId
    });

    return res.status(201).json(group);
});



/**
 * @swagger
 * /api/groups/{groupId}/membership:
 *   post:
 *     summary: Request a membership for a group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group
 *     responses:
 *       200:
 *         description: Membership requested successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 memberId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   enum: [pending]
 *       404:
 *         description: Group not found
 *       400:
 *         description: Membership already requested or user is already a member
 */
// Request a membership for a group
router.post('/:groupId/membership', async (req, res) => {
    const { user } = req;

    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);

    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }

    const membership = await GroupMembership.findOne({
        where: {
            memberId: user.id,
            groupId: groupId
        }
    })

    if (membership) {
        if (membership.status === 'pending') {
            return res.status(400).json({ message: "Membership has already been requested" });
        } else {
            return res.status(400).json({ message: "User is already a member of the group" });
        }
    }

    // where to get invitation value from ?
    let groupMembershipDetails = { memberId: user.id, status: 'pending' };
    await GroupMembership.create({ groupId, ...groupMembershipDetails, invitation: generateRandomSeed() });

    return res.status(200).json(groupMembershipDetails);
});



/**
 * @swagger
 * /api/groups/{groupId}:
 *   put:
 *     summary: Edit a group
 *     tags: [Groups]
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
 *               private:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Group edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 private:
 *                   type: boolean
 *       404:
 *         description: Group not found
 *       403:
 *         description: Forbidden
 */
// Edit a group
router.put('/:groupId', validateGroup, async (req, res) => {
    const groupId = req.params.groupId;
    const { name, description, private } = req.body;
    const group = await Group.findByPk(groupId);

    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }

    if (group.organizerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }

    group.name = name;
    group.description = description;
    group.private = private;
    await group.save();

    return res.json(group);
});



/**
 * @swagger
 * /api/groups/{groupId}/membership:
 *   put:
 *     summary: Edit group membership status
 *     tags: [Groups]
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
 *               memberId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [pending, member, co-admin]
 *     responses:
 *       200:
 *         description: Membership status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 groupId:
 *                   type: integer
 *                 memberId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   enum: [pending, member, co-admin]
 *       404:
 *         description: Group or user not found
 *       403:
 *         description: Unauthorized
 *       400:
 *         description: Membership status already set
 */
// Edit group membeship status
router.put('/:groupId/membership', validateMembershipStatus, async (req, res) => {
    const { user } = req;
    const groupId = req.params.groupId;
    const { memberId, status } = req.body;

    const group = await Group.findByPk(groupId);

    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }

    const member = await User.findByPk(memberId);

    if (!member) {
        return res.status(404).json({ message: "User couldn't be found" });
    }

    const membership = await GroupMembership.findOne({
        where: {
            groupId,
            memberId
        }
    });

    if (!membership) {
        return res.status(404).json({ message: "Membership between the user and the group does not exist!" });
    }

    if (membership.status === status) {
        return res.status(400).json({ message: "Membership already has specified status!" });
    }

    const isOrganizer = user.id === group.organizerId;
    const currentUserMembership = await GroupMembership.findOne({
        where: {
            groupId,
            memberId: user.id
        }
    });

    // user must be organizer or co-admin of the group to update membership status to "member"
    if (status === 'member') {
        const hasRequiredMembershipStatus = currentUserMembership && (currentUserMembership.status === 'co-admin');

        if (!isOrganizer && !hasRequiredMembershipStatus) {
            return res.status(403).json({
                message: "User don't have privileges to update group membership status to member!"
            });
        }
    }

    // user must be organizer of the group to update membership status to "co-admin"
    if (status === 'co-admin') {
        if (!isOrganizer) {
            return res.status(403).json({
                message: "User don't have privileges to update group membership status to co-admin!"
            });
        }
    }

    membership.status = status;
    await membership.save();

    return res.json({
        id: membership.id,
        groupId: group.id,
        memberId,
        status
    });
});



/**
 * @swagger
 * /api/groups/{groupId}:
 *   delete:
 *     summary: Delete a group
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group
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
 *         description: Group couldn't be found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Group couldn't be found
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forbidden
 */
// Delete a group
router.delete('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId);

    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }

    if (group.organizerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }

    await group.destroy();
    return res.json({ message: "Successfully deleted" });
});



module.exports = router;

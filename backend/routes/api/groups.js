const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Group, User, GroupMembership, Channel, } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
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
    check('group_invitation')
        .exists({ checkFalsy: true })
        .withMessage('Seed not sufficient'),
    handleValidationErrors
];

// Function to generate a random seed

const generateRandomSeed = () => {
    return Math.random().toString(36).substr(2, 16).padEnd(16, '0'); // Generates a seed with exactly 16 characters
};





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
    console.log("🚀 ~ router.get ~ groups:", groups[0].dataValues)
    return res.json({ Groups: groups });
});



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

    return res.json(group);
});

// Create a group
router.post('/', validateGroup, async (req, res) => {
    const { name, description, private, img_AWS_link } = req.body;
    const organizerId = req.user.id;
    console.log("organizerId", organizerId);

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

// Edit group membeship status
router.put('/:groupId/membership', async (req, res) => {
    const { user } = req;
    const groupId = req.params.groupId;
    const { memberId, status } = req.body;

    if (status === 'pending') {
        return res.status(400).json({ message: "Cannot change a membership status to pending" });
    }

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

    if (status === 'member') {
        const hasRequiredMembershipStatus = currentUserMembership && (currentUserMembership.status === 'co-admin');

        if (!isOrganizer && !hasRequiredMembershipStatus) {
            return res.status(403).json({ 
                message: "User don't have privileges to update group membership status to member!" 
            });
        }
    }

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

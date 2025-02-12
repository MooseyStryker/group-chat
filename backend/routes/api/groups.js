const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Group, User, Membership, GroupMembership, Channel } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

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
    const groups = await Group.findAll({
        where: { private: false },
    });

    if (req.isMembership) {
        const allGroups = await Group.findAll();
    }

    // Should I fetch everything and then filter if they are not a member of the group?
    // Or should I fetch conditionally, either all or just the public ones?
    return res.json({ Groups: groups });
});

// Get all groups joined or organized by the current user
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    console.log(userId);
    const groups = await Group.findAll({
        include: [
            { model: User, as: 'Organizer', where: { id: userId } },
            { model: GroupMembership, where: { userId } }
        ],
        where: {
            [Op.or]: [
                { '$Organizer.id$': userId },
                { '$GroupMembership.userId$': userId }
            ]
        }
    });
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
router.post('/', requireAuth, validateGroup, async (req, res) => {
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
router.put('/:groupId', requireAuth, validateGroup, async (req, res) => {
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

// Delete a group
router.delete('/:groupId', requireAuth, async (req, res) => {
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

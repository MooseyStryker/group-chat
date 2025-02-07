const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Group, User, Membership } = require('../../db/models');
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
    handleValidationErrors
];

// Get all groups
router.get('/', async (req, res) => {
    const groups = await Group.findAll({
        where: { private: false },
        include: [{ model: User, as: 'Organizer' }]
    });
    res.json({ Groups: groups });
});

// Get all groups joined or organized by the current user
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const groups = await Group.findAll({
        include: [
            { model: User, as: 'Organizer', where: { id: userId } },
            { model: Membership, where: { userId } }
        ]
    });
    res.json({ Groups: groups });
});

// Get details of a group from an id
router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;
    const group = await Group.findByPk(groupId, {
        include: [
            { model: User, as: 'Organizer' },
            { model: Membership },
            { model: Event, as: 'Live Events' }
        ]
    });

    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }

    res.json(group);
});

// Create a group
router.post('/', requireAuth, validateGroup, async (req, res) => {
    const { name, description, private, img_AWS_link } = req.body;
    const organizerId = req.user.id;

    const group = await Group.create({
        name,
        description,
        private,
        group_invitation: generateRandomSeed(),
        img_AWS_link,
        organizerId
    });

    res.status(201).json(group);
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

    res.json(group);
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
    res.json({ message: "Successfully deleted" });
});

module.exports = router;
const express = require('express')

const { upload, deletePhoto } = require('../../utils/aws_helper')
const { handleValidationErrors } = require('../../utils/validation')
const { requireGroupMembership } = require('../../utils/auth')
const { ChannelChatPhoto } = require('../../db/models')


const router = express.Router({mergeParams: true})

router.use(requireGroupMembership)



/**
 * @swagger
 * /api/groups/{groupId}/channels/{channelId}/channel_chat/{channelChatId}/photos:
 *   get:
 *     summary: Get all the channel chat photos for a channel
 *     tags: [Channel Chat Photos]
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
 *         description: A list of channel chat photos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 channelChatPhotos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       channelId:
 *                         type: integer
 *                       userId:
 *                         type: integer
 *                       imgAWSLink:
 *                         type: string
 *       404:
 *         description: Channel not found
 */
// Get all the photos in a channel chat
router.get('/', async (req, res) => {
    const channelId = req.params.channelId
    const allPhotos = await ChannelChatPhoto.findAll({
        where:{
            channelId: channelId
        }
    })

    res.status(201).json({
        channelChatPhotos: allPhotos
    })

})


/**
 * @swagger
 * /api/groups/{groupId}/channels/{channelId}/channel_chat/{channelChatId}/photos:
 *   post:
 *     summary: Post a new photo in a channel chat
 *     tags: [Channel Chat Photos]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully posted a new photo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     channelId:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     imgAWSLink:
 *                       type: string
 *       500:
 *         description: Internal server error
 */
// Posts a new photo in a channel chat
router.post('/', upload, async (req,res) => {
    const channelId = req.params.channelId
    const { user } = req

    const file = req.file
    try{
        const newImage = await ChannelChatPhoto.create({
            channelId: channelId,
            userId: user.id,
            imgAWSLink: file.location
        })

        res.status(200).json({
            message: newImage
        })


    } catch (error){
        console.error(error);
        res.status(500).json({
            error: error
        })
    }
})

/**
 * @swagger
 * /api/groups/{groupId}/channels/{channelId}/channel_chat/{channelChatId}/photos/{photoId}:
 *   delete:
 *     summary: Delete a photo from a channel chat
 *     tags: [Channel Chat Photos]
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
 *         name: photoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the photo
 *     responses:
 *       200:
 *         description: Successfully deleted the photo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: You don't have permission to delete this photo
 *       404:
 *         description: Photo ID cannot be found
 */
router.delete('/:photoId', async (req,res) => {
    const photoId = req.params.photoId
    const { user } = req

    const photo = await ChannelChatPhoto.findByPk(photoId)

    if (!photo){
        return res.status(404).json({
            message: "Photo ID cannot be found"
        })
    }

    if(user.id !== photo.userId){
        return res.status(403).json({
            message: "You don't have permission to delete this photo"
        })
    }

    // Deletes the photo from aws
    await deletePhoto(photo)

    // Deletes the aws image link in db
    await photo.destroy()

    return res.status(200).json({
        message: 'Successfully deleted.'
    })
})

module.exports = router

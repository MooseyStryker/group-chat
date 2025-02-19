const express = require('express')

const { upload, deletePhoto } = require('../../utils/aws_helper')
const { handleValidationErrors } = require('../../utils/validation')
const { requireGroupMembership } = require('../../utils/auth')
const { ChannelChatPhoto } = require('../../db/models')


const router = express.Router({mergeParams: true})

router.use(requireGroupMembership)

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

const express = require('express')
const { Op, Model } = require('sequelize')
const { Conversation, User, Message } = require('../../db/models')
const conversation = require('../../db/models/conversation')

const router = express.Router()

// Finds all conversations the user has with other users
// Finds all messages with each conversation
router.get('/', async (req,res,next) => {
    const { user } = req

    // Eager loaded to allow frontend to access the messages fast within one search
    const getAllConverstations = await Conversation.findAll({
        where:{
            [Op.or]:[
                { user1Id: user.id},
                { user2Id: user.id}
            ]
        },
        include: [
            {
                model: User,
                attributes:{
                    exclude: ['id', 'email', 'hashedPassword', 'firstName', 'lastName', 'createdAt', 'updatedAt']
                }

            },
            {
                model: Message,
                attributes:{
                    exclude: ['createdAt', 'updatedAt']
                }
            }
        ],
    })


    if (!getAllConverstations){
        res.status(404).json({
            conversations: 'No conversations found'
        })
    }

    for (let conversation of getAllConverstations){
        if (conversation.user1Id !== user.id && conversation.user2Id !== user.id) {
            res.status(400).json({
                forbidden: 'You do not have permission to view this message'
            })
        }
    }

    res.status(200).json({
        conversations: getAllConverstations
    })
})


// Finds all messages with a single conversation
router.get('/:conversationId', async (req,res,next) => {
    const conversationId = req.params.conversationId
    const { user } = req

    const isPartOfTheConversation = await Conversation.findByPk(conversationId)
    if (!isPartOfTheConversation){
        return res.status(404).json({
            message: 'Conversation between users not found'
        })
    }

    if (isPartOfTheConversation.user1Id !== user.id && isPartOfTheConversation.user2Id !== user.id) {
        return res.status(403).json({
            forbidden: 'You do not have permission to view this conversation'
        })
    }

    const getAllMessagesInOneConversation = await Message.findAll({
        where:{
            conversationId
        },
        attributes:{
            exclude: ['createdAt','updatedAt', 'userId', 'conversationId']
        }
    })

    res.json(getAllMessagesInOneConversation)
})


// Adds a conversation between users
router.post('/', async (req,res,next) => {
    const { invitedUserId } = req.body
    console.log("🚀 ~ router.post ~ invitedUserId:", invitedUserId)
    const { user } = req

    const doesUserExist = await User.findByPk(invitedUserId)
    if (!doesUserExist){
        return res.status(404).json({
            message: 'Invited user does not exist'
        })
    }

    const existingConversation = await Conversation.findOne({
        where:{
            [Op.or]:[
                {
                    user1Id: invitedUserId,
                    user2Id: user.id
                },
                {
                    user1Id: user.id,
                    user2Id: invitedUserId
                }
            ]
        }
    })


    if (existingConversation){
        return res.status(400).json({
            message: 'You are already in a conversation with this user'
        })
    }

    const newConversation = await Conversation.create({
        user1Id: invitedUserId,
        user2Id: user.id
    })

    return res.status(200).json({
        conversation: newConversation
    })
})


// Post a comment in a conversation
router.post('/:conversationId/messages', async (req,res,next) =>{
    const { conversationId } = req.params
    const { user } = req
    const { content } = req.body

    const conversation = await Conversation.findByPk(conversationId)

    if(!conversation){
        return res.status(404).json({
            message: "No conversation was found"
        })
    }
    if (conversation.user1Id !== user.id && conversation.user2Id !== user.id){
        return res.status(401).json({
            forbidden: "You cannot add a message to a conversation that you don't belong to"
        })
    }
    if (!content || content.length === 0){
        return res.status(400).json({
            message: "Message cannot be empty"
        })
    }

    const safeMessage = {
        conversationId,
        userId: user.id,
        content,
        sentAt: new Date().toISOString()
    }

    await Message.create(safeMessage)

    return res.status(201).json({
        newMessage: safeMessage
    })
})



// Edits the users message
router.put('/messages/:messageId', async (req,res,next) => {
    const messageId = req.params.messageId
    const { user } = req
    const { content } = req.body

    const message = await Message.findByPk(messageId)

    if (!message){
        return res.status(404).json({
            message: "Message was not found"
        })
    }

    if (user.id !== message.userId){
        return res.status(401).json({
            forbidden: "You cannot edit a message that isn't yours"
        })
    }
    if(content === message.content){
        return res.status(400).json({
            message: "Cannot edit the message with the same content"
        })
    }
    message.previousContentBeforeEditted = message.content
    message.content = content.length === 0 ? "[ Message Deleted ]" : content

    await message.save()

    return res.status(202).json({
        message: "Successfully edited your message"
    })
})



// This router allows the message to be edited to say "[ Message Deleted ]"
// The attribute "previousContentBeforeEditted" will store the original message if needed
router.put('/messages/:messageId/delete', async (req,res,next) => {
    const messageId = req.params.messageId
    const { user } = req

    const message = await Message.findByPk(messageId)

    if (!message){
        return res.status(404).json({
            message: "Message was not found"
        })
    }

    if (user.id !== message.userId){
        return res.status(401).json({
            forbidden: "You cannot delete a message that isn't yours"
        })
    }

    message.previousContentBeforeEditted = message.content
    message.content = content.length === 0 ? "[ Message Deleted ]" : content

    await message.save()

    return res.status(202).json({
        message: "Successfully edited your message"
    })
})



// Deletes conversation table and all messages attached to it
router.delete('/:conversationId/messages/', async (req,res,next) => {
    const { conversationId } = req.params
    const { user } = req

    const conversation = await Conversation.findByPk(conversationId)
    if(!conversation){
        return res.status(404).json({
            message: "No conversation was found"
        })
    }
    if (conversation.user1Id !== user.id && conversation.user2Id !== user.id){
        return res.status(401).json({
            forbidden: "You cannot delete a conversation that you don't belong to"
        })
    }

    const allMessages = await Message.findAll({
        where: {
            conversationId
        }
    })


    for (const message of allMessages){
        await message.destroy()
    }
    await conversation.destroy()


    return res.status(200).json({
        message: "Conversation and messages successfully deleted"
    })
})





module.exports = router

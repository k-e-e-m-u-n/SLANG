import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const {recepientId} = req.params
        const message = req.body
        const senderId = req.user._id

        let conversation = await Conversation.findOne({
            participants:{$all:[senderId, recepientId ]}
        })

        if (!conversation) {
            conversation = new Conversation({
                participants:{senderId, recepientId},
                lastMessage:{
                    text: message,
                    sender: senderId
                 }
            })
         await conversation.save()
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text : message
        })

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage:{
                    text: message,
                    sender: senderId
                }
            })
        ])

        const recievedMessage = getRecipientSocketId(recepientId)
        if (recievedMessage) {
            io.to(recievedMessage).emit('newMessage', newMessage)
        }

        res.status(200).json(newMessage)
    } catch (error) {
        res.status(500).json(error.message)
        console.log(error);
    }
}
export const getMessage = () => {}
export const deleteMessage = () => {}
export const updateMessage = () => {}
import {Server} from 'socket.io';
import express from 'express';
import http from 'http'
import Message from '../models/messageModel.js'
import Conversation from '../models/conversationModel.js'

const app = express()
const server = http.createServer(app)
export const io = new Server(server,{
    cors : {
        origin: 'http://localhost:2332',
        methods: ['GET', 'POST', 'DELETE', 'PATCH']
    }
})

export const getRecipientSocketId = (recipientId) => {
    return socketMap[recipientId]
}

const socketMap = {}

io.on = ('connection',(socket) => {
    console.log('connected successfully', socket.id);
    const userId = socket.handshake.query.userId
    if (userId !== 'undefined') socketMap[userId]
    io.emit('check online users',Object.keys(socketMap)) 
    socket.on('markMessageAsRead', async({conversationId, userId}) => {
        try {
            await Message.updateMany({conversationId: conversationId, seen:false} , {$set :{ seen:true}})
            await Conversation.updateOne({_id:conversationId}, {$set:{seen:true}})
            io.to(socketMap[userId]).emit('messagesSent',{conversationId, userId})
        } catch (error) {
            console.log(error);
        }
    })

    socket.on('disconnect', () => {
        console.log('user disconnected successfully');
        delete socketMap[userId]
        io.emit('check online users',Object.keys(socketMap)) 
    })
})



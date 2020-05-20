const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

const Message = require('../database/models/message');
const Room = require('../database/models/room');
const User = require('../database/models/user');

/**
 * get message from room
 */
router.post('', checkAuth, async (req, res) => {
    const roomId = req.body.roomId;
    const getMessages = await Message.find({roomId: roomId}).sort({createdAt: 1}).exec()

    if (!getMessages) {
        return res.json({
            message: 'cannot find Message'
        })
    }
    return res.json({
        message: 'cannot find Message',
        data: getMessages
    })
});

/**
 * create message
 */
router.post('/save', checkAuth, async (req, res) => {
    const from = req.userData._id.toString();

    const {roomId, message} = req.body

    const newMessage = new Message({
        roomId,
        message,
        from
    });

    const saveMessage = await newMessage.save();

    if (!saveMessage) {
        return res.json({
            message: 'cannot save message'
        });
    }

    return res.json({
        message: 'saved successfully',
        data: saveMessage
    });
});

/**
 * Delete message
 */
router.post('/delete/:messageId', checkAuth, async (req, res) => {
    const messageId = req.params.messageId;

    const deleteMessage = await Message.remove({_id: messageId}).exec();

    if(!deleteMessage){
        return res.json({
            message: 'Message delete fail'
        })
    }
    return res.json({
        message: 'message was deleted',
    });
});

// --------------------------------------------------------------------------------------

// create room
router.post('/room/get', checkAuth, async (req, res) => {
    let room = null;

    if (!req.body.listUser || !Array.isArray(req.body.listUser)) {
        return res.status(301).json({
            message: 'Invalid user information in a room',
            data: room,
        });
    }

    if (req.body.listUser.length <= 1) {
        // default always contain 1 id of yourself
        return res.status(301).json({
            message: 'Room cannot be created alone',
            data: room,
        });
    }

    const findUsers = await User.find({
        _id: {$in: req.body.listUser}
    }).exec();

    if (findUsers.length === 0) {
        return res.status(301).json({
            message: 'Cannot find any associated users to create the room',
            data: room,
        });
    }

    const listIds = findUsers.map(function (model) {
        return model.toObject()._id.toString();
    }).filter(id => id !== req.userData._id.toString());

    try {
        room = await Room.findOne({
            listUser: {
                $all: [...listIds, req.userData._id.toString()],
                $size: listIds.length + 1 // +1 as yourself
            }
        }).populate('listUser')
            .exec();
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Query error!', room: null
        });
    }

    if (!room) {
        // query tim k thay ket qua
        room = new Room({
            listUser: [...listIds, req.userData._id.toString()]
        });
        // tao record moi
        await room.save();
    }

    return res.status(200).json({
        message: "Created room successfully",
        data: room,
    });
});

/**
 * find room
 */
router.post('/findRoom', checkAuth, async (req, res) => {
    const {userId, friendId} = req.body;

    const findRoom = await Room.findOne({
        listUser: [
            userId,
            friendId
        ]
    });

    if(!findRoom){
        return res.json({
            message: 'cannot find any room'
        })
    }
    return res.json({
        message: 'room founded',
        data: findRoom
    });
});
module.exports = router;

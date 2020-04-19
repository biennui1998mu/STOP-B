const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

const Message = require('../database/models/message');
const Room = require('../database/models/room');
const User = require('../database/models/user');

// get message from room
router.post('', (req, res) => {
    const roomId = req.body.roomId;
    Message.find({
        roomId: roomId
    }).sort({createdAt: 1})
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                messages: docs.map(doc => {
                    return {
                        _id: doc._id,
                        roomId: doc.roomId,
                        message: doc.message,
                        from: doc.from,
                        createdAt: doc.createdAt
                    }
                })
            };
            // console.log(response);
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

// create message
router.post('/save', checkAuth, (req, res) => {
    const message = new Message({
        _id: mongoose.Types.ObjectId(),
        roomId: req.body.roomId,
        message: req.body.message,
        from: req.userData.userId,
    });
    message.save()
        .then(result => {
            // console.log(result);
            return res.status(200).json({
                _id: result._id,
                roomId: result.roomId,
                message: result.message,
                from: result.from,
                createdAt: result.createdAt
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// Delete message
router.post('/delete/:messageId', (req, res) => {
    const messageId = req.params.messageId;

    Message.remove({_id: messageId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'message was deleted',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Error: err,
            })
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
    }).filter(id => id !== req.userData.userId);

    try {
        room = await Room.findOne({
            listUser: {
                $all: [...listIds, req.userData.userId],
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
            _id: mongoose.Types.ObjectId(),
            listUser: [...listIds, req.userData.userId]
        });
        // tao record moi
        await room.save();
    }

    return res.status(200).json({
        message: "Created room successfully",
        room: room,
    });
});

// find room
router.post('/findRoom', (req, res) => {
    Room.findOne({
        listUser: [req.body.userId, req.body.friendId]
    }, function (err, room) {
        if (room) {
            return res.json(room);
        } else {
            return err;
        }
    })
});
module.exports = router;

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

const Message = require('../database/models/message');
const Room = require('../database/models/room');

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
            console.log(response);
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
        createdAt: Date.now()
    });
    message.save()
        .then(result => {
            console.log(result);
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
    try {
        room = await Room.findOne({
            $or: [
                {listUser: {$all: [...req.body.listUser, req.userData.userId]}},
                {listUser: {$all: [req.userData.userId, ...req.body.listUser]}}
            ]
        }).exec();
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
            listUser: req.body.listUser
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
        roomName: req.body.roomName,
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

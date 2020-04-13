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
    })
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
                        // to: doc.to,
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
router.post('/create', (req, res) => {
    const message = new Message ({
        _id: mongoose.Types.ObjectId(),
        roomId: req.body.roomId,
        message: req.body.message,
        from: req.body.from,
        // to: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        createdAt: Date.now()
    });
    message.save()
        .then(result => {
            console.log(result);
            return res.status(200).json({
                message: "Created message successfully",
                createdNote: {
                    _id: result._id,
                    roomId: result.roomId,
                    message: result.message,
                    from: result.from,
                    // to: result.to,
                    createdAt: result.createdAt
                }
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
router.post('/createRoom', (req, res) => {
    Room.find({roomName: req.body.roomName})
        .exec()
        .then( roomName => {
            if(roomName.length >= 1){
                return res.status(409).json({
                    message: 'room\'s name exist'
                });
            }else{
                const room = new Room ({
                    _id: mongoose.Types.ObjectId(),
                    roomName: req.body.roomName
                });
                room.save()
                    .then(result => {
                        console.log(result);
                        return res.status(200).json({
                            message: "Created room successfully",
                            createdNote: {
                                _id: result._id,
                                roomName: result.roomName
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            }
        })
});

module.exports = router;

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

const User = require('../database/models/user');
const friendRequest = require('../database/models/friendRequest');

// Get all friend from list
router.post('/list', checkAuth, async (req, res) => {
    const userId = req.userData.userId;

    if (!userId) {
        // ... xu ly validate
    }
    let listFriendRequest = [];
    try {
        const listFriendDoc = await friendRequest.find({
            $or: [
                {requester: userId},
                {recipient: userId},
            ],
            status: 1
        }).populate('requester recipient').exec();
        listFriendRequest = listFriendDoc.map(doc => doc.toObject());
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            Error: e
        });
    }


    if (listFriendRequest.length === 0) {
        // neu chua ket ban thi cu tra ve array rong, k can xu ly gi them
        return res.json([]);
    }

    // Array chua friend
    const arrayParser = [];
    listFriendRequest.forEach(request => {
        if (request.requester._id.toString() === userId) {
            const user = request.recipient;
            // Add request vao nhu search user
            // Minh chi can id va status
            user.friendRequest = {
                _id: request._id.toString(),
                status: request.status,
            };
            arrayParser.push(user);
        } else {
            const user = request.requester;
            // Add request vao nhu search user
            // Minh chi can id va status
            user.friendRequest = {
                _id: request._id.toString(),
                status: request.status,
            };
            arrayParser.push(request.requester);
        }
    });
    return res.json(arrayParser);
});

// send friend request
router.post('/add', checkAuth, (req, res) => {
    const sendRequest = new friendRequest({
        _id: new mongoose.Types.ObjectId(),
        requester: req.userData.userId,
        recipient: req.body.recipient,
        status: 0
    });
    sendRequest.save()
        .then(result => {
            console.log(result);
            return res.status(200).json({
                message: "send request successfully",
                sendRequest: {
                    _id: result._id,
                    requester: result.requester,
                    recipient: result.recipient,
                    status: result.status
                }
            });
        })
        .catch()
});

// Get friend request
router.post('/request', checkAuth, async (req, res) => {
    try {
        const requests = await friendRequest.find({
            recipient: req.userData.userId,
            status: 0
        }).populate([`requester`, `recipient`])
            .exec();

        return res.json(requests);
    } catch (e) {
        console.log(e);
        return res.status(500);
    }
});

// add friend request - change status of request to 1 or 2
router.post('/request/update/:requestId', (req, res) => {
    const id = req.params.requestId;
    const updateOps = {...req.body};

    console.log(updateOps);

    friendRequest.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            return res.status(200).json({
                message: 'Request updated',
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                Error: err
            });
        });
});

// Check friend online
router.post('/online', (req, res) => {
    User.find({
        userStatus: 1
    }, function (err, requests) {
        if (requests) {
            return res.json(requests);
        } else {
            return err;
        }
    })
});

module.exports = router;

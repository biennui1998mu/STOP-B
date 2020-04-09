const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

const User = require('../database/models/user');
const friendRequest = require('../database/models/friendRequest');

// Get all friend from list
router.post('/list', (req, res) => {
    // const userId = req.userData.userId;
    const userId = req.body.userId;

    if(!userId){
        // ... xu ly validate
    }
    friendRequest.find({
        $or: [
            {requester: userId},
            {recipient: userId},
        ],
        status: 1
    }, function (err, friends) {
        if(friends){
            return res.json(friends);
        }else{
            return err;
        }
    });
});

// send friend request
router.post('/add', checkAuth, (req, res) => {
    const sendRequest = new friendRequest({
        _id: new mongoose.Types.ObjectId(),
        requester: req.userData.userId,
        // requester: req.body.requester,
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
router.post('/request', checkAuth, (req, res) => {
    friendRequest.find({
        recipient: req.userData.userId
        // recipient: req.body.userId
    }, function (err, requests) {
        if(requests){
            return res.json(requests);
        }else{
            return err;
        }
    })
});

// add friend request - change status of request to 1 or 2
router.post('/request/update', checkAuth, (req, res) => {
    const id = req.body._id;
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

module.exports = router;

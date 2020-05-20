const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const friendRequest = require('../database/models/friendRequest');

/**
 * Get all friend from list
 */
router.post('/list', checkAuth, async (req, res) => {
    const userId = req.userData._id.toString();

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
            error: e
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

/**
 * send friend request
 */
router.post('/add', checkAuth, async (req, res) => {
    const requester = req.userData._id.toString();
    const recipient = req.body.recipient

    const sendRequest = new friendRequest({
        requester,
        recipient
    });

    const sendSuccess = await sendRequest.save()

    if (!sendSuccess) {
        return res.json({
            message: 'send fail'
        })
    }
    return res.json({
        message: "send request successfully",
        sendRequest: sendSuccess
    });
});

/**
 * Get friend request
 */
router.post('/request', checkAuth, async (req, res) => {
    try {
        const requests = await friendRequest.find({
            recipient: req.userData._id.toString(),
            status: 0
        }).populate([`requester`, `recipient`])
            .exec();
        return res.json(requests);
    } catch (e) {
        console.log(e);
        return res.status(500);
    }
});

/**
 * add friend request - change status of request to 1 or 2
  */
router.post('/request/update/:requestId', checkAuth, async (req, res) => {
    const id = req.params.requestId;
    const updateOps = {...req.body};

    const updateRequest = await friendRequest.findOneAndUpdate(
        {_id: id},
        updateOps,
        {
            new: true
        }
    ).exec()

     if(!updateRequest){
         return res.json({
             message: 'Request cannot updated'
         });
     }

    return res.json({
        message: 'Request updated',
        data: updateRequest
    });
});

module.exports = router;

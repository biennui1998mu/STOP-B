const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

const User = require('../database/models/user');
const friendRequest = require('../database/models/friendRequest');

// Get all friend from list
router.post('/getFriendList', (req, res) => {
    const id = req.body.userId;
    if(!id){
        // ... xu ly validate
    }
    User.findById(id)
        .exec()
        .then(doc => {
            User.find({
                _id: doc.friends
            }, function (err, users) {
                if(users){
                    return res.json(users)
                }else{
                    return res.json({
                        message: 'Lỗi ở đây'
                    })
                }
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            })
        });
});

// Add friend


module.exports = router;

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const friendRequest = require('../database/models/friendRequest');
const User = require('../database/models/user');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + " " + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //reject
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// take all user from list user
router.post('/', (req, res, next) => {
    User.find({})
        .exec()
        .then(users => {
            if (users.length >= 1) {
                const response = {
                    count: users.length,
                    users: users.map(user => {
                        return {
                            _id: user._id,
                            username: user.username,
                            password: user.password,
                            name: user.name,
                            dob: user.dob,
                            avatar: user.avatar,
                            Status: user.Status
                        }
                    })
                };
                res.status(200).json(response)
            } else {
                res.status(200).json({
                    message: 'No user found',
                })
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'No user found',
                error: err,
            })
        })
});

// take user by ID
router.post('/view', checkAuth, (req, res, next) => {
    const id = req.userData.userId;

    if (!id) {
        // ... xu ly validate
    }
    User.findById(id)
        .exec()
        .then(user => {
            if (user) {
                return res.status(200).json(user)
            } else {
                return res.status(404).json({
                    message: 'No user found by id'
                })
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            })
        })
});

// take user by ID
router.post('/friend', checkAuth, (req, res) => {
    const friendId = req.body.friendId;

    if (!friendId) {
        // ... xu ly validate
    }
    User.findById(friendId)
        .exec()
        .then(user => {
            if (user) {
                return res.status(200).json(user)
            } else {
                return res.status(404).json({
                    message: 'No friend found by id'
                })
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            })
        })
});

// Search user by username or name
router.post('/search', checkAuth, async (req, res) => {
    const input = req.body.input;

    try {
        const users = await User.find({
            $and: [
                {
                    $or: [
                        {username: new RegExp(input)},
                        {name: new RegExp(input)}
                    ]
                },
                {
                    _id: {$ne: req.userData.userId} // not to get yourself :D
                }
            ]
        }).limit(10).exec();

        if (!users || users.length === 0) {
            return res.json([]);
        }
        // parse to object for ease in use
        const parsed = users.map(function (model) {
            return model.toObject();
        });

        // get friend request to you that associated with found users
        const getFriendRequest = await friendRequest.find({
            $or: [
                {
                    requester: req.userData.userId,
                    recipient: {$in: parsed.map(user => user._id)}
                },
                {
                    recipient: req.userData.userId,
                    requester: {$in: parsed.map(user => user._id)}
                },
            ]
        }).exec();
        // parse to object for ease in use
        const requestWithMe = getFriendRequest.map(function (model) {
            return model.toObject();
        })

        // Manually add custom friendRequest field to the return users model.
        const finalReturn = parsed.map(user => {
            const friendRequest = requestWithMe.find(request => {
                return request.requester.toString() === user._id.toString() ||
                    user._id.toString() === request.recipient.toString()
            });
            if (friendRequest) {
                user.friendRequest = friendRequest;
            }
            return user;
        })
        return res.json(finalReturn);
    } catch (e) {
        console.log(e);
        return res.status(500).json([]);
    }
});

// signup
router.post('/signUp', upload.single('avatar'), (req, res, next) => {
    User.find({username: req.body.username})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'username exist'
                });
            } else {
                const url = `${process.env.PROTOCOL}://${process.env.HOST_NAME}:${process.env.PORT}/`;

                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password: hash,
                            name: req.body.name,
                            dob: req.body.dob,
                            Status: 2,
                            avatar: url + "uploads/sample.png"
                        });
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'Created account successfully',
                                    createdUser: {
                                        _id: result._id,
                                        username: result.username,
                                        password: result.password,
                                        name: result.name,
                                        dob: result.dob,
                                        Status: result.Status,
                                        avatar: result.avatar
                                    }
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                });
            }
        })
});

// signin
router.post('/signIn', async (req, res, next) => {
    const {username, password} = req.body;

    const user = await User.findOne({username: username})
        // chi dinh print field bi hidden by default trong schema.
        .select('+password')
        .exec();

    if (!user) {
        return res.status(401).json({
            message: 'Auth fail 1'
        });
    }

    const validatePassword = await bcrypt.compare(password, user.password);

    if (validatePassword) {
        const toResponse = user.toObject();
        delete toResponse.password;
        delete toResponse.__v;
        // let userResponse = delete toResponse.password;
        // console.dir(toResponse);
        // console.dir(userResponse);

        const token = jwt.sign({
                username: user.username,
                userId: user._id,
                name: user.name
            },
            process.env.JWT_KEY,
            {
                expiresIn: 604800
            });
        console.log(jwt.verify(token, process.env.JWT_KEY));
        console.log(token);
        return res.status(200).json({
            message: 'Auth successful',
            token: token,
            user: toResponse
        });
    } else {
        res.status(401).json({
            message: 'Auth fail 3'
        });
    }
});

// Update user
router.post('/update/:userId', (req, res) => {
    const id = req.params.userId;
    const updateOps = {...req.body};

    // console.log(updateOps);

    User.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            return res.status(200).json({
                message: 'User updated',
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                Error: err
            });
        });
});

// Delete user
router.post('/delete/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User was deleted',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Error: err,
            })
        });
});

module.exports = router;






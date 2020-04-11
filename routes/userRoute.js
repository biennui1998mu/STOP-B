const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

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

const User = require('../database/models/user');
const friendRequest = require('../database/models/friendRequest')

// take all user from list user
router.post('/', (req, res, next) => {
    User.find({

    })
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
                            userStatus: user.userStatus
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
router.post('/view', (req, res, next) => {
    const id = req.params.userId;
    if (!id) {
        // ... xu ly validate
    }
    User.findById(id)
        .exec()
        .then(user => {
            if (user) {
                res.status(200).json({
                    user: user
                })
            } else {
                res.status(404).json({
                    message: 'No user found by id'
                })
            }
            res.status(200).json(user);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

// Search user by username or name
router.post('/search', (req, res) => {
    const input = req.body.input;

    // if(input.length < 2){
    //     return res.json({
    //         message: 'Must be at least 2 character'
    //     })
    // }else{
        User.find({
            $or: [
                {username: new RegExp(input)},
                {name: new RegExp(input)}
            ]
        }, function (err, users) {
            if(users){
                return res.json(users);
            }else{
                return err;
            }
        }).limit(10);
    // }
});

// signup
router.post('/signUp', upload.single('avatar'), (req, res, next) => {
    User
        .find({username: req.body.username})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'username exist'
                });
            } else {
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
                            userStatus: 2,
                            avatar : req.file.path
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
                                        userStatus: result.userStatus,
                                        avatar : result.avatar
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
        .select('+password') // chi dinh print field bi hidden by default trong schema.
        .exec();

    if (user.length < 1) {
        return res.status(401).json({
            message: 'Auth fail 1'
        });
    }

    const validatePassword = await bcrypt.compare(password, user.password);

    if (validatePassword) {
        const token = jwt.sign({
                username: user.username,
                userId: user._id,
                name: user.name
            },
            process.env.JWT_KEY,
            {
                expiresIn: 3600
            });
        console.log(jwt.verify(token, process.env.JWT_KEY));
        console.log(token);
        return res.status(200).json({
            message: 'Auth successful',
            token: token
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

    console.log(updateOps);

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






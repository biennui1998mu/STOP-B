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
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
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

//list user
router.get('/', (req, res, next) => {
    User.find()
        .select('_id username password name dob avatar')
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
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/users/' + user._id
                            }
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

//search by ID
router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        // .select('_id username password name dob avatar')
        .exec()
        .then(user => {
            if (user) {
                res.status(200).json({
                    user: user,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/users'
                    }
                })
            } else {
                res.status(404).json({
                    message: 'No user found by ID'
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

//Search by string
router.post('/search', (req, res) => {
    const getUsername = req.body.username;

    if(getUsername.length < 3){
        return res.json({
            message: 'Must be at least 3 character'
        })
    }else{
        User.find({
            username : new RegExp(getUsername)
        }, function (err, users) {
            if(users){
                return res.json(users);
            }else{
                return err;
            }
        }).limit(10)
    }
});

//signup
router.post('/signup', upload.single('avatar'), (req, res, next) => {
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
                                        response: {
                                            type: 'GET',
                                            url: 'http://localhost:3000/users/' + result._id
                                        }
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

//signin
router.post('/signin', async (req, res, next) => {
    const {username, password} = req.body;

    const user = await User.findOne({username: username}).exec();

    if (user.length < 1) {
        return res.status(401).json({
            message: 'Auth fail 1'
        });
    }

    const validatePassword = await bcrypt.compare(password, user.password);

    if (validatePassword) {
        const token = jwt.sign({
                username: user.username,
                userId: user._id
            },
            process.env.JWT_KEY,
            {
                expiresIn: "1h"
            });
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

    // User.find({username: req.body.username})
    //     .exec()
    //     .then(user => {
    //         if(user.length < 1){
    //             return res.status(401).json({
    //                 message:  'Auth fail 1'
    //             });
    //         }
    //         bcrypt.compare(req.body.password,  user[0].password, (err, result) => {
    //             if(err){
    //                 return res.status(401).json({
    //                     message:  'Auth fail 2'
    //                 });
    //             }
    //             if(result){
    //                 const token = jwt.sign({
    //                     username: user[0].username,
    //                     userid: user[0]._id
    //                 },
    //                     process.env.JWT_KEY,
    //                     {
    //                         expiresIn: "1h"
    //                     });
    //                 return res.status(200).json({
    //                     message:  'Auth successful',
    //                     token: token
    //                 });
    //             }
    //             res.status(401).json({
    //                 message:  'Auth fail 3'
    //             });
    //         })
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).json({
    //             Error : err,
    //         })
    //     });
});

router.delete('/:userid', checkAuth, (req, res, next) => {
    User.remove({id: req.params.userid})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User was deleted'
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






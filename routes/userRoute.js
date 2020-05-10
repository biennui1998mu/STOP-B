const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const friendRequest = require('../database/models/friendRequest');
const User = require('../database/models/user');
const moment = require('moment');

/**
 * https://github.com/expressjs/multer
 * @type {multer}
 */
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        return (null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    /**
     * filter file upload only image type
     */
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

/**
 * sign-in / login the user based on the username/password
 */
router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    let user = null;
    try {
        user = await User.findOne({
            username: username
        })
            // chi dinh print field bi hidden by default trong schema.
            .select('+password +previousToken')
            .exec();
    } catch (e) {
        return res.status(500).json({
            message: 'Unable to query the user',
            data: null,
            error: e,
        });
    }

    if (!user) {
        return res.status(401).json({
            message: 'Username not found',
            data: null,
        });
    }
    let validatePassword = false;
    try {
        validatePassword = await bcrypt.compare(password, user.password);
    } catch (e) {
        return res.status(500).json({
            message: 'Unable to check the password',
            data: null,
            error: e,
        });
    }

    if (!validatePassword) {
        return res.status(401).json({
            message: 'Password does not match.',
            data: null,
        });
    }

    /**
     * retrieve the list of stored token for refresh.
     * @type {string[]}
     */
    const cachedToken = user.previousTokens || [];
    /**
     * @type {string}
     */
    let token;
    try {
        token = jwt.sign({
                _id: user._id,
                name: user.name,
                username: user.username,
                avatar: user.avatar,
            },
            process.env.JWT_KEY,
            {
                expiresIn: 604800
            });
    } catch (e) {
        return res.status(500).json({
            message: 'Unable to sign token',
            data: null,
            error: e
        });
    }
    /**
     * Push the new token to the tracking token list.
     */
    cachedToken.push(token);
    user.previousTokens = cachedToken;
    user.status = 1;                // set online
    user.lastOnline = Date.now();   // set the last time online
    await user.save();              // save the new information

    // Because user is a mongoose.document
    // => which does not provide some method like normal object.
    const userObject = user.toObject();
    delete userObject.password;         // remove field `password` from object
    delete userObject.__v;              // remove field `__v` (version Key mongoose) from object
    delete userObject.previousTokens;   // remove field `previousTokens` from object

    return res.status(200).json({
        message: 'Auth successful',
        data: {
            token: token,
            user: userObject,
        },
    });
});

/**
 * Sign-up / register a new user.
 */
router.post('/register', async (req, res) => {
    const {name, username, password, dob} = req.body;

    if (!name || !username || !password) {
        return res.status(301).json({
            message: 'Missing important data to register the user!'
        });
    }

    if (!moment(dob).isValid()) {
        return res.status(301).json({
            message: 'Day of birth is in invalid format'
        });
    }

    try {
        const matchedUser = await User.findOne({
            username: username
        });

        if (matchedUser) {
            return res.status(409).json({
                message: 'Username exist'
            });
        }
    } catch (e) {
        return res.status(500).json({
            message: 'Database failure',
            data: null,
            error: e,
        })
    }

    let hashedPassword = null;

    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (e) {
        return res.status(500).json({
            message: 'Hashing failure',
            data: null,
            error: e,
        });
    }

    const user = new User({
        username: username,
        password: hashedPassword,
        name: name,
        dob: dob,
    });

    try {
        await user.save();
    } catch (e) {
        return res.status(500).json({
            message: 'Unable to create the user',
            error: e,
        });
    }

    return res.status(200).json({
        message: 'Create account successfully.',
        data: user._id,
    });
});

/**
 * sign-out / Logout the user => remove token from list previousTokens
 */
router.post('/logout', checkAuth, async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    /**
     * @type string[]
     */
    const currentTokens = req.userData.previousTokens;

    try {
        // find again in DB...
        const user = await User.findById(req.userData._id).exec();
        user.previousTokens = currentTokens.filter(
            cached => cached !== token
        );
        await user.save();
        return res.status(200).json({
            message: 'Logout successfully',
            data: true,
        });
    } catch (e) {
        return res.status(500).json({
            message: 'unable to save the new state',
            data: false,
            error: e,
        });
    }
})

/**
 * get our own information
 */
router.post('/view', checkAuth, (req, res) => {
    const id = req.userData._id.toString();
    User.findById(id)
        .exec()
        .then(user => {
            return res.status(200).json({
                message: 'Retrieved user information',
                data: user
            })
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({
                message: 'Failed to retrieve user info',
                error: err
            })
        })
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
                            status: user.status
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

// search friend
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
                        {username: new RegExp(input, 'i')},
                        {name: new RegExp(input, 'i')}
                    ]
                },
                {
                    _id: {$ne: req.userData._id.toString()} // not to get yourself :D
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
                    requester: req.userData._id.toString(),
                    recipient: {$in: parsed.map(user => user._id)}
                },
                {
                    recipient: req.userData._id.toString(),
                    requester: {$in: parsed.map(user => user._id)}
                },
            ]
        }).exec();
        // parse to object for ease in use
        const requestWithMe = getFriendRequest.map(function (model) {
            return model.toObject();
        });

        // Manually add custom friendRequest field to the return users model.
        const finalReturn = parsed.map(user => {
            const friendRequest = requestWithMe.find(request => {
                return request.requester.toString() === user._id.toString() ||
                    request.recipient.toString() === user._id.toString()
            });

            if (friendRequest) {
                user.friendRequest = friendRequest;
            }
            return user;
        });
        return res.json(finalReturn);
    } catch (e) {
        console.log(e);
        return res.status(500).json([]);
    }
});

// Update user
router.post('/update', checkAuth, upload.single('avatar'), (req, res) => {
    const id = req.userData._id;
    let update = {...req.body};
    if (req.file) {
        update.avatar = req.file.originalname;
    }

    User.update({_id: id}, {$set: update})
        .exec()
        .then(result => {
            return res.status(200).json({
                message: 'User updated',
                data: true,
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err,
                data: false,
            });
        });
});

// Delete user
router.post('/delete/:userId', (req, res) => {
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
                error: err,
            })
        });
});

module.exports = router;






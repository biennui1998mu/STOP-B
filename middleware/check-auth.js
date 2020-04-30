const jwt = require('jsonwebtoken');
const User = require('../database/models/user');

module.exports = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }

    try {
        const currentToken = req.headers.authorization.split(" ")[1];
        const userToken = jwt.verify(currentToken, process.env.JWT_KEY);
        // find in DB for sure
        const user = await User.findById(userToken._id)
            .select('+previousTokens') // get field which is hidden
            .exec();
        if (!user) {
            return res.status(401).json({
                message: 'User does not exist',
            });
        }

        const isTokenCached = user.previousTokens.some(
            oldToken => oldToken === currentToken
        )

        if (!isTokenCached) {
            return res.status(401).json({
                message: 'Token is not associated with the account!',
            });
        }
        req.userData = user; // return mongoose **object** so be careful as it's not JSON Object
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'auth failed',
            error: error
        })
    }
};

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let urlHost;

if (process.env.IS_DEPLOYMENT) {
    // Deploy thi k can port (lay host name)
    urlHost = `${process.env.PROTOCOL}://${process.env.HOST_NAME}`;
} else {
    urlHost = `${process.env.PROTOCOL}://${process.env.HOST_NAME}:${process.env.PORT}`;
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false // loai field password ra khoi tat ca cac query default.
    },
    name: {type: String, required: true},
    dob: {type: Date},
    /**
     * Future implementation?
     * 3 = busy
     * 2 = offline
     * 1 = online
     */
    status: {type: Number, default: 2},
    avatar: {type: String, default: `${urlHost}/uploads/sample.png`},

    /**
     * use for refresh the token after it expire. We will check if the previous token
     * is stored here, or the token user got will be invalid and unable to refresh.
     * If the token is refreshed
     */
    previousTokens: [{type: String, select: false, default: []}],
    /**
     * track the last time online
     */
    lastOnline: {type: Date},
});

module.exports = mongoose.model('User', userSchema);

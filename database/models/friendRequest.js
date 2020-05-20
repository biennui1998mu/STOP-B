const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const friendRequestSchema = new Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('friendRequest', friendRequestSchema);

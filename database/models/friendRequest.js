const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const friendRequestSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    requester: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    recipient: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: Number
});

module.exports = mongoose.model('friendRequest', friendRequestSchema);

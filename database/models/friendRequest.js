const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const friendRequestSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    requester: String,
    recipient: String,
    status: Number
});

module.exports = mongoose.model('friendRequest', friendRequestSchema);

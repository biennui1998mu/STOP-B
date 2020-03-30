const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const friendsSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    requester: String,
    recipient: String,
    status: Boolean
});

module.exports = mongoose.model('Friends', friendsSchema);

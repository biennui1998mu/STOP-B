const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    roomName: {type: String},
    listUser: {type: [mongoose.Schema.Types.ObjectId], ref: 'User'}
});

module.exports = mongoose.model('Room', roomSchema);

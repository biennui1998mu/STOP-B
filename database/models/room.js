const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    roomName: String
});

module.exports = mongoose.model('Room', roomSchema);

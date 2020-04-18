const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    listUser: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Room', roomSchema);

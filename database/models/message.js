const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    roomId: {type: mongoose.Schema.Types.ObjectId, ref: 'Room'},
    message: String,
    from: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    // to: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: Date
});

module.exports = mongoose.model('Chat', chatSchema);

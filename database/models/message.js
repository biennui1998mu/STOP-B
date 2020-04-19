const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    roomId: {type: mongoose.Schema.Types.ObjectId, ref: 'Room'},
    message: String,
    from: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Chat', chatSchema);

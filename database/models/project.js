const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    priority: {type: Number, required: true},
    colorCover: {type: String, default: '#14579c'},
    colorText: {type: String, default: '#ffffff'},

    manager: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    moderator: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    member: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],

    status: {type: Boolean, default: false},
    startDate: {type: Date, default: Date.now},
    endDate: {type: Date, required: true},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Project', projectSchema);

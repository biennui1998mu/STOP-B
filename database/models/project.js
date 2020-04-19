const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    Title: {type: String, required: true},
    Description: String,
    Priority: {type: Number, required: true},
    StartDate: Date,
    EndDate: Date,
    Status: {type: Boolean, required: true},
    Manager: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    Moderator: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    Member: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
});

module.exports = mongoose.model('Project', projectSchema);

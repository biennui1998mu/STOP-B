const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    UserId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    Title: { type: String, required: true},
    Description: String,
    Priority: {type: Number, required: true},
    StartDate: Date,
    Status: Boolean,
    ProjectId: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
});

module.exports = mongoose.model('Note', noteSchema);

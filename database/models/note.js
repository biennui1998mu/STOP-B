const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    noteTitle: { type: String, required: true},
    noteDescription: String,
    notePriority: {type: Number, required: true},
    noteStartDate: Date,
    noteStatus: Boolean,
    noteProjectId: {type: [mongoose.Schema.Types.ObjectId], ref: 'Project'},
});

module.exports = mongoose.model('Note', noteSchema);

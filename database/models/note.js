const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    noteTitle: { type: String, required: true},
    notePara: String,
    notePriority: { type: Boolean, required: true},
    noteDate: Date
});

module.exports = mongoose.model('Note', noteSchema);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    description: {type: String},
    /**
     * 0 = normal
     * 1 = important
     */
    priority: {type: Number, required: true},
    /**
     * 0 = doing
     * 1 = done
     */
    status: {type: Boolean, default: 0},
    project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Note', noteSchema);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const planSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    planTitle: {type: String, required: true},
    planTaskID: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true},
    planPriority: {type: Boolean, required: true},
    planDate: Date,
    planMember: []
});

module.exports = mongoose.model('Plan', planSchema);

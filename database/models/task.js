const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    createdBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    projectId: [{type: mongoose.Schema.Types.ObjectId, ref: 'Project'}],
    taskAssign: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    taskTitle: {type: String, required: true},
    taskDescription: String,
    taskPriority: {type: Number, required: true},
    taskStartDate: Date,
    taskEndDate: Date,
    taskStatus: Boolean
});

module.exports = mongoose.model('Task', taskSchema);

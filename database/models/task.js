const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    taskTitle : { type: String, required: true},
    taskDescription: String,
    taskPriority: {type: Number, required: true},
    taskStartDate: Date,
    taskEndDate: Date,
    taskStatus: Boolean,
    taskManager: {type: [mongoose.Schema.Types.ObjectId], ref: 'User'}
});

module.exports = mongoose.model('Task' , taskSchema)

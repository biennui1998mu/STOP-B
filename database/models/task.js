const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    taskTitle : { type: String, required: true},
    taskPara : String
});

module.exports = mongoose.model('Task' , taskSchema)

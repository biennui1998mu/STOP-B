const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentIssueSchema = new Schema({
    content: {type: String},
    referenceTasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],

    task: {type: mongoose.Schema.Types.ObjectId, ref: 'Task'},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date},
});

module.exports = mongoose.model(
    'CommentIssue',
    commentIssueSchema
);

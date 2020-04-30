const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentIssueSchema = new Schema({
    /**
     * content markdown
     */
    content: {type: String, required: true},
    /**
     * related task
     */
    task: {type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date},
    /**
     * future feature
     */
    referenceTasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
});

module.exports = mongoose.model(
    'CommentIssue',
    commentIssueSchema
);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentIssueSchema = new Schema({
    /**
     * content markdown
     */
    content: {type: String},
    /**
     * related task
     */
    task: {type: mongoose.Schema.Types.ObjectId, ref: 'Task'},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
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

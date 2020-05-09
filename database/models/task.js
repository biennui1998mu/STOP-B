const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String},
    /**
     * from 0->3
     * 0 = none, 1 = low, 2 = medium, 3 = high
     */
    priority: {type: Number, required: true},
    /**
     * default can start at the time create the task or can be another time.
     */
    startDate: {type: Date, default: Date.now},
    /**
     * can be null
     */
    endDate: {type: Date},
    /**
     * 0 = open
     * 1 = closed
     */
    status: {type: Number, default: 0},
    /**
     * The person who create the issue
     */
    issuer: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    /**
     * belongs to what project
     */
    project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
    /**
     * Who needs to do this task
     */
    assignee: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    /**
     * comment in the issues
     */
    comment: [{type: mongoose.Schema.Types.ObjectId, ref: 'CommentIssue'}],

    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date},
});

/**
 * https://github.com/ramiel/mongoose-sequence
 */
taskSchema.plugin(AutoIncrement, {
    id: 'indicator_seq',            // required if use reference_fields
    inc_field: 'indicator',         // plugin auto create this field in schema
    reference_fields: ['project'] // only increment based on projectId
});

module.exports = mongoose.model(
    'Task',
    taskSchema
);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    projectUserId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    projectTitle: {type: String, required: true},
    projectDescription: String,
    projectPriority: {type: Number, required: true},
    projectStartDate: Date,
    projectEndDate: Date,
    projectStatus: Boolean,
    projectTaskID: { type: [mongoose.Schema.Types.ObjectId], ref: 'Task'},
    projectManager: {type: [mongoose.Schema.Types.ObjectId], ref: 'User'},
    projectModerator: {type: [mongoose.Schema.Types.ObjectId], ref: 'User'},
    projectMember: {type: [mongoose.Schema.Types.ObjectId], ref: 'User'}
});

module.exports = mongoose.model('Project', projectSchema);

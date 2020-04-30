const jwt = require('jsonwebtoken');
const Project = require('../database/models/project');
const Task = require('../database/models/task');

module.exports = async (req, res, next) => {
    /**
     * accept both object `project/task` and `project_id/task_id`
     * Prioritize `project_id/task_id`
     */
    const {project, project_id, task, task_id} = req.body;
    let userId = null;

    let isError = null;
    if (req.userData) {
        // If has userData (check-auth middleware) then
        // skip query DB for faster
        userId = req.userData._id.toString();
    } else {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const userData = jwt.verify(token, process.env.JWT_KEY);
            userId = userData.userId;
            if (!userId) {
                isError = new Error('Missing user identification!');
                console.error(isError);
            }
        } catch (e) {
            isError = e;
            console.error(isError);
        }

        if (isError) {
            return res.status(401).json({
                message: 'auth failed',
                data: null,
                error: isError,
            });
        }
    }

    if (!project_id && (!project || !project._id) && !req.projectData) {
        return res.status(301).json({
            message: 'Missing project information',
            data: null,
        });
    }

    if (!task_id && (!task || !task._id)) {
        return res.status(301).json({
            message: 'Missing task information',
            data: null,
        });
    }

    let dataProject;

    if (req.projectData) {
        // If has projectData (check-project middleware) then
        // skip query DB for faster
        dataProject = req.projectData;
    } else {
        dataProject = await Project.findOne({
            _id: project_id ? project_id : project._id,
            $or: [
                {manager: userId},
                {moderator: {$in: [userId]}},
                {member: {$in: [userId]}},
            ]
        }).populate('manager moderator member').exec();
    }

    if (!dataProject) {
        return res.status(301).json({
            message: 'Incorrect project information',
            data: null,
        });
    } else {
        req.projectData = dataProject;
    }

    const dataTask = await Task.findOne({
        _id: task_id ? task_id : task._id,
        project: dataProject._id,
    }).populate(
        'issuer project assignee'
    ).exec();

    if (!dataTask) {
        return res.status(301).json({
            message: 'Incorrect task information',
            data: null,
        });
    }
    req.taskData = dataTask;
    return next();

};

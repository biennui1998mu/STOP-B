// TODO: middleware check project
const jwt = require('jsonwebtoken');
const Project = require('../database/models/project');

module.exports = async (req, res, next) => {
    const {project} = req.body;
    let userId = null;

    let isError = null;
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

    if (!project || !project._id) {
        return res.status(301).json({
            message: 'Missing project information',
            data: null,
        });
    }

    const dataProject = await Project.findOne({
        _id: project._id,
        $or: [
            {manager: userId},
            {moderator: {$in: [userId]}},
            {member: {$in: [userId]}},
        ]
    }).populate('manager moderator member').exec();

    if (dataProject) {
        req.projectData = dataProject;
        return next();
    }

    return res.status(301).json({
        message: 'Incorrect project information',
        data: null,
    });
};

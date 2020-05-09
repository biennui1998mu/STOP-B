const jwt = require('jsonwebtoken');
const Project = require('../database/models/project');

/**
 * check xem la user do co trong project nay khong
 * @param req
 * @param res
 * @param next
 * @return {Promise<any>}
 */
module.exports = async (req, res, next) => {
    /**
     * accept both object `project` and `project_id` and '_id'
     * Prioritize `project_id`
     */
    const {project, project_id, _id} = req.body;
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
            userId = userData._id;
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

    if (!project_id && !(project && project._id) && !_id) {
        return res.status(301).json({
            message: 'Missing project information',
            data: null,
        });
    }

    let projectId = project_id ? project_id :
        project ? project._id : _id;

    const dataProject = await Project.findOne({
        _id: projectId,
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

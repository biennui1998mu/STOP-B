const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const checkAuth = require('../middleware/check-auth');
const checkProject = require('../middleware/check-project');

const Task = require('../database/models/task');
const Project = require('../database/models/project');

/**
 * Get the latest task created in the project
 */
router.post('/latest', checkAuth, checkProject, async (req, res) => {
    const currentProject = req.projectData;

    let getLatestTag = null;

    try {
        getLatestTag = await Task.findOne({
            project: currentProject._id,
        }).sort('-indicator').exec();
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: 'Got error in query',
            data: null,
            error: e
        })
    }

    return res.status(200).json({
        message: 'Got latest task!',
        data: getLatestTag,
    })
})

/**
 * create a new task and return the new task back to the client.
 */
router.post('/create', checkAuth, checkProject, (req, res) => {
    const currentUser = req.userData;
    const currentProject = req.projectData;
    // Object destructuring => get data in the body
    const {title, description, priority, startDate, endDate, assignee} = req.body;
    // person who create the issue
    const issuer = currentUser._id.toString();

    /**
     * shorthand response with fixed message.
     * @param field which field has the error
     * @param error (optional) passing error from try/catch
     * @returns {any}
     */
    const responseError = (field, error) => {
        return res.status(301).json({
            data: null,
            message: `${field} is not valid`,
            error: error
        });
    }

    if (!title || typeof title !== 'string' || title.length === 0) {
        return responseError('title');
    }

    if (!priority || isNaN(Number(priority)) || Number(priority) < 0) {
        return responseError('priority');
    }

    if (startDate) {
        const parsed = moment(String(startDate), 'x');
        if (!parsed.isValid()) {
            return responseError('startDate');
        }
    }

    if (endDate) {
        const momentEndDate = moment(String(endDate), 'x');
        if (!momentEndDate.isValid()) {
            return responseError('endDate');
        }
        if (startDate) {
            const momentStartDate = moment(String(startDate), 'x');
            if (momentEndDate.isBefore(momentStartDate)) {
                return res.status(301).json({
                    data: null,
                    message: `endDate cannot happen before startDate`,
                });
            }
        }
    }

    if (assignee) {
        if (!Array.isArray(assignee)) {
            // must be an array
            return responseError('assignee');
        }

        if (assignee.length > 0) {
            // check if contain field _id
            const userAssignee = assignee.filter(user => !!user._id);

            if (userAssignee.length !== assignee.length) {
                // if when filter, an user does not have a _id field
                // then the array output will have different length
                return responseError('assignee');
            }

            const getMemberProject = [
                ...currentProject.moderator,
                ...currentProject.member,
                currentProject.manager,
            ];
            const isNotInvolved = [];
            userAssignee.forEach(user => {
                const findNotInGetMember = getMemberProject.find(member =>
                    member._id.toString() !== user._id // member is still mongoose doc
                );
                if (findNotInGetMember) {
                    isNotInvolved.push(user);
                }
            });

            if (isNotInvolved.length > 0) {
                return res.status(301).json({
                    data: isNotInvolved,
                    message: `Some members did not participate this project`,
                });
            }
        }
    }

    const task = new Task({
        title,
        description,
        priority,
        startDate,
        endDate,
        issuer,
        status: 0, // default open status
        project: currentProject._id,
        assignee: assignee ? assignee.map(user => user._id) : [],
    });

    task.save()
        .then(result => {
            return res.status(200).json({
                message: 'Created task successfully',
                data: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Failed to create the task',
                error: err
            })
        })
});

/**
 * Get all the task in the project
 * TODO might need to paginate
 */
router.post('/', checkAuth, checkProject, (req, res) => {
    const currentProject = req.projectData;

    Task.find({
        project: currentProject._id
    }).sort(
        '-indicator'
    ).populate(
        'issuer'
    ).exec().then(docs => {
        const countFinished = docs.filter(
            task => task.status === 1
        ).length;
        const countOngoingTask = docs.length - countFinished;
        const response = {
            message: 'Fetched all tasks',
            data: {
                ongoingCount: countOngoingTask,
                finishedCount: countFinished,
                tasks: docs,
            },
        };
        res.status(200).json(response)
    }).catch(err => {
        res.status(500).json({
            message: 'Error while fetching the data',
            data: [],
            error: err
        });
    })
});

/**
 * view the task
 */
router.post('/view', checkAuth, checkProject, (req, res) => {
    const currentProject = req.projectData;
    const {indicator} = req.body;

    if (!indicator) {
        return res.status(301).json({
            message: 'Missing criteria to find the task.',
            data: null,
        });
    }

    Task.findOne({
        indicator: indicator,
        project: currentProject._id,
    }).populate(
        'issuer project assignee'
    ).exec().then(task => {
        if (task) {
            return res.status(200).json({
                message: 'Queried the task successfully',
                data: task,
            });
        }
        return res.status(404).json({
            message: 'No valid id was found',
            data: null,
        })
    }).catch(err => {
        console.error(err);
        res.status(500).json({
            message: 'Error occurred while querying.',
            data: null,
            error: err,
        })
    });
});

// Update task by ID
router.post('/update/:taskId', (req, res) => {
    const id = req.params.taskId;
    const updateOps = {...req.body};

    console.log(updateOps);

    Task.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            return res.status(200).json({
                message: 'Task updated',
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                Error: err
            });
        });
});

// Delete task by ID
router.post('/delete/:taskId', (req, res) => {
    const id = req.params.taskId;
    Task.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Task was deleted',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Error: err,
            })
        });
});

// query 2 tasks, high priority
router.post('/important', (req, res) => {
    Task.find({
        Priority: {
            $lte: 2
        },
        Status: true,

    }, function (err, tasks) {
        if (tasks) {
            return res.json(tasks);
        } else {
            return err;
        }
    }).limit(2)
});

module.exports = router;

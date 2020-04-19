const moment = require('moment');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

const Project = require('../database/models/project');
const Task = require('../database/models/task');

// Take all projects from list
router.post('/', checkAuth, (req, res) => {
    Project.find({manager: req.userData.userId})
        .exec()
        .then(docs => {
            const response = {
                message: 'Retrieved all project successfully',
                data: docs
            };
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(500).json({
                message: 'Retrieved all project error',
                data: null,
                error: err,
            })
        })
});

// Take project from db by ID
router.post('/view', checkAuth, async (req, res) => {
    const projectId = req.body._id;
    const userId = req.userData.userId;
    if (!projectId) {
        // ... xu ly validate
        return res.status(301).json({
            message: 'Cannot find project with empty id.',
            data: null
        })
    }
    let project = null;

    try {
        project = await Project.findById(projectId)
            .populate('manager moderator member')
            .exec();

        if (!project) {
            return res.status(301).json({
                message: 'Project not found',
                data: null
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Query find project error!',
            data: null,
            error: e
        })
    }

    const isManager = project.manager && project.manager._id.toString() === userId;
    let isModerator = false;
    let isMember = false;
    if (!isManager && project.moderator) {
        isModerator = !!project.moderator.find(
            moderator => moderator._id === userId,
        );
    }
    if (!isModerator && project.member) {
        isMember = project.member.find(
            member => member._id === userId
        );
    }
    if (!isManager && !isModerator && !isMember) {
        // neu k trong project do thi se k tim thay project do
        // nhu github private repo
        return res.status(301).json({
            message: 'Project not found',
            data: null
        });
    }

    return res.status(200).json({
        message: 'Success get project data',
        data: project,
    })
});

// Search by string
router.post('/search', (req, res) => {
    const input = req.body.search;

    if (input.length < 2) {
        return res.json({
            message: 'Must be at least 2 character'
        })
    } else {
        Project.find({
            $or: [
                {title: new RegExp(input, 'i')},
                {description: new RegExp(input, 'i')}
            ]
        }, function (err, projects) {
            if (projects) {
                return res.json(projects);
            } else {
                return err;
            }
        }).limit(10);
    }
});

// Create new project
router.post('/create', checkAuth, (req, res) => {
    const userId = req.userData.userId;

    const project = new Project({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        startDate: Date.now(),
        endDate: req.body.endDate,
        status: false,
        manager: userId,
        moderator: req.body.moderator,
        member: req.body.member
    });
    project.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Project has been created',
                createdProject: {
                    _id: result._id,
                    title: result.title,
                    description: result.description,
                    priority: result.priority,
                    startDate: result.startDate,
                    endDate: result.endDate,
                    status: result.status,
                    manager: result.manager,
                    moderator: result.moderator,
                    member: result.member
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// Update note by ID
router.post('/update/:projectId', (req, res) => {
    const id = req.params.projectId;
    const updateOps = {...req.body};

    console.log(updateOps);

    Project.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            return res.status(200).json({
                message: 'Project updated',
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                Error: err
            });
        });
});

// Delete note by ID
router.post('/delete/:projectId', (req, res) => {
    const id = req.params.projectId;
    Project.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Project was deleted',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Error: err,
            })
        });
});

// query 3 projects, high priority
router.post('/important', checkAuth, (req, res) => {
    Project.find({
        manager: req.userData.userId,
        priority: {
            $lte: 2
        },
        status: false

    }, function (err, projects) {
        if (projects) {
            return res.json(projects);
        } else {
            return err;
        }
    }).limit(3)
});

module.exports = router;

const moment = require('moment');
const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const checkProject = require("../middleware/check-project");

const Project = require('../database/models/project');

// Take all projects from list
router.post('/', checkAuth, (req, res) => {
    Project.find({
        $or: [
            {manager: req.userData._id.toString()},
            {moderator: {$in: [req.userData._id.toString()]}},
            {member: {$in: [req.userData._id.toString()]}},
        ]
    }).populate(
        'manager moderator member'
    ).exec().then(docs => {
        const response = {
            message: 'Retrieved all project successfully',
            data: docs
        };
        res.status(200).json(response)
    }).catch(err => {
        res.status(500).json({
            message: 'Retrieved all project error',
            data: null,
            error: err,
        })
    })
});

// Take project from db by ID
router.post('/view', checkAuth, checkProject, async (req, res) => {
    const userId = req.userData._id.toString();
    let project = req.projectData;

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
    const userId = req.userData._id.toString();

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
                data: result
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
router.post('/update', checkAuth, async (req, res) => {
    const user = req.userData;
    const projectId = req.body._id;
    const {
        title, description,
        priority, colorCover,
        colorText, manager,
        moderator, member,
        status, startDate, endDate
    } = req.body;

    const dataProject = await Project.findOne({
        _id: projectId,
        $or: [
            {manager: user._id},
            {moderator: {$in: [user._id]}},
        ]
    }).exec();

    if (!dataProject) {
        return res.status(404).json({
            message: 'Project not found',
        });
    }

    if (title) {
        dataProject.title = title;
    }
    if (description) {
        dataProject.description = description;
    }
    if (priority) {
        dataProject.priority = priority;
    }
    if (colorCover) {
        dataProject.colorCover = colorCover;
    }
    if (colorText) {
        dataProject.colorText = colorText;
    }
    if (manager && manager._id && dataProject.manager === user._id) {
        // only the manager is able to change the manager
        if (
            dataProject.moderator.find(mod => mod === manager._id) ||
            dataProject.member.find(member => member === manager._id)
        ) {
            // assigner must be in the project
            dataProject.manager = manager._id;
        }
    }
    if (moderator) {
        // TODO future check
        dataProject.moderator = moderator.map(mod => mod._id).filter(id => !!id)
    }
    if (member && Array.isArray(member)) {
        // TODO future check
        dataProject.member = member.map(mem => mem._id).filter(id => !!id);
    }
    if (status) {
        dataProject.status = status;
    }
    if (
        startDate && moment(startDate).isValid() &&
        moment(startDate).isAfter(moment(dataProject.createdAt))
    ) {
        dataProject.startDate = startDate;
    }
    if (
        endDate && moment(endDate).isValid() &&
        moment(endDate).isAfter(moment(dataProject.startDate))
    ) {
        dataProject.endDate = endDate;
    }

    await dataProject.save();
    return res.status(200).json({
        message: 'Project updated',
        data: dataProject
    });
});

// Delete note by ID
router.post('/delete/:projectId', checkAuth, (req, res) => {
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
        manager: req.userData._id.toString(),
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

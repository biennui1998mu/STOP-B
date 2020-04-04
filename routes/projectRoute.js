const moment = require('moment');
const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

const Project = require('../database/models/project');

// Take all projects from list
router.post('/', (req, res) => {
    Project.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                projects : docs.map(doc => {
                    return {
                        _id: doc._id,
                        projectTitle: doc.projectTitle,
                        projectDescription: doc.projectDescription,
                        projectPriority: doc.projectPriority,
                        projectStartDate: doc.projectStartDate,
                        projectEndDate: doc.projectEndDate,
                        projectStatus: doc.projectStatus,
                        projectTaskID: doc.projectTaskID,
                        projectManager: doc.projectManager,
                        projectModerator: doc.projectModerator,
                        projectMember: doc.projectMember
                    }
                })
            };
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

// Take project from db by ID
router.post('/view', (req, res) => {
    const id = req.body.projectId;
    if(!id) {
        // ... xu ly validate
    }
    Plan.findById(id)
        .populate(['projectTaskID'])
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if(doc) {
                return res.status(200).json({
                    project: doc,
                })
            }
            return res.status(404).json({
                message: 'No valid id was found',
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            })
        })
});

// Search by string
router.post('/search', (req, res) => {
    const input = req.body.search;

    if(input.length < 2){
        return res.json({
            message: 'Must be at least 2 character'
        })
    }else{
        Project.find({
            $or: [
                {projectTitle: new RegExp(input)},
                {projectDescription: new RegExp(input)}
            ]
        }, function (err, projects) {
            if(projects){
                return res.json(projects);
            }else{
                return err;
            }
        }).limit(10);
    }
});

// Create new project
router.post('/createProject', (req, res) => {
    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        projectTitle: req.body.projectTitle,
        projectDescription: req.body.projectDescription,
        projectPriority: req.body.projectPriority,
        projectStartDate: Date.now(),
        projectEndDate: req.body.projectEndDate,
        projectStatus: req.body.projectStatus,
        projectTaskID: req.body.projectTaskID,
        projectManager: req.body.projectManager,
        projectModerator: req.body.projectModerator,
        projectMember: req.body.projectMember
    });
    project.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Project has been created',
                createdPlan: {
                    _id: result._id,
                    projectTitle: result.projectTitle,
                    projectDescription: result.projectDescription,
                    projectPriority: result.projectPriority,
                    projectStartDate: result.projectStartDate,
                    projectEndDate: result.projectEndDate,
                    projectStatus: result.projectStatus,
                    projectTaskID: result.projectTaskID,
                    projectManager: result.projectManager,
                    projectModerator: result.projectModerator,
                    projectMember: result.projectMember
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
                Error : err,
            })
        });
});

module.exports = router;

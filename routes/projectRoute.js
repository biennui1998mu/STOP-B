const moment = require('moment');
const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

const Project = require('../database/models/project');
const Task = require('../database/models/task');

// Take all projects from list
router.post('/', checkAuth, (req, res) => {
    Project.find({Manager: req.userData.userId})
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                projects : docs.map(doc => {
                    return {
                        _id: doc._id,
                        Title: doc.Title,
                        Description: doc.Description,
                        Priority: doc.Priority,
                        StartDate: doc.StartDate,
                        EndDate: doc.EndDate,
                        Status: doc.Status,
                        Manager: doc.Manager,
                        Moderator: doc.Moderator,
                        Member: doc.Member
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
    Project.findById(id)
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
                {Title: new RegExp(input)},
                {Description: new RegExp(input)}
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
router.post('/create', (req, res) => {
    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        Title: req.body.Title,
        Description: req.body.Description,
        Priority: req.body.Priority,
        StartDate: Date.now(),
        EndDate: req.body.EndDate,
        Status: false,
        Manager: req.body.Manager,
        Moderator: req.body.Moderator,
        Member: req.body.Member
    });
    project.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Project has been created',
                createdProject: {
                    _id: result._id,
                    Title: result.Title,
                    Description: result.Description,
                    Priority: result.Priority,
                    StartDate: result.StartDate,
                    EndDate: result.EndDate,
                    Status: result.Status,
                    Manager: result.Manager,
                    Moderator: result.Moderator,
                    Member: result.Member
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

// query 3 projects, high priority
router.post('/important', checkAuth, (req, res) => {
    Project.find({
        Manager: req.userData.userId,
        Priority: {
            $lte : 2
        },
        Status: false

    }, function (err, projects) {
        if(projects){
            return res.json(projects);
        }else{
            return err;
        }
    }).limit(3)
});

module.exports = router;

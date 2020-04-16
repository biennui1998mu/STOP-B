const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

const Task = require('../database/models/task');

// Take all tasks from list
router.post('/', (req, res) => {
    Task.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                tasks : docs.map(doc => {
                    return {
                        _id: doc._id,
                        Manager: doc.Manager,
                        projectId: doc.projectId,
                        Title: doc.Title,
                        Description: doc.Description,
                        Priority: doc.Priority,
                        StartDate: doc.StartDate,
                        EndDate: doc.EndDate,
                        Status: doc.Status
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

// Take task from db by ID
router.post('/view', (req, res, next) => {
    const id = req.body.taskId;
    if(!id){
        // ... xu ly validate
    }
    Task.findById(id)
        .exec()
        .then( task => {
            if(task) {
                return res.status(200).json({
                    task: task
                });
            }
            return res.status(404).json({
                message: 'No valid id was found',
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

// Create task
router.post('/create', (req, res, next) => {
    const task = new Task({
        _id : new mongoose.Types.ObjectId,
        Manager : req.body.Manager,
        projectId : req.body.projectId,
        Title : req.body.Title,
        Description : req.body.Description,
        Priority : req.body.Priority,
        StartDate: Date.now(),
        EndDate: req.body.EndDate,
        Status : req.body.Status
    });
    task.save()
        .then(result => {
            return res.status(200).json({
                message: 'created task successfully',
                createdTask: {
                    _id: result._id,
                    Manager : result.Manager,
                    projectId : result.projectId,
                    Title : result.Title,
                    Description : result.Description,
                    Priority : result.Priority,
                    StartDate: result.StartDate,
                    EndDate: result.EndDate,
                    Status : result.Status
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
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
            $lte : 2
        },
        Status: true,

    }, function (err, tasks) {
        if(tasks){
            return res.json(tasks);
        }else{
            return err;
        }
    }).limit(2)
});

module.exports = router;

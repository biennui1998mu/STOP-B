const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

const Task = require('../database/models/task');

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
router.post('/createTask', (req, res, next) => {
    const task = new Task({
        _id : new mongoose.Types.ObjectId,
        taskTitle : req.body.taskTitle,
        taskDescription : req.body.taskDescription,
        taskPriority : req.body.taskPriority,
        taskStartDate: Date.now(),
        taskEndDate: req.body.taskEndDate,
        taskStatus : req.body.taskStatus,
        taskManager : req.body.taskManager,
    });
    task.save()
        .then(result => {
            return res.status(200).json({
                message: 'created task successfully',
                createdTask: {
                    _id: result._id,
                    taskTitle : result.taskTitle,
                    taskDescription : result.taskDescription,
                    taskPriority : result.taskPriority,
                    taskStartDate: result.taskStartDate,
                    taskEndDate: result.taskEndDate,
                    taskStatus : result.taskStatus,
                    taskManager : result.taskManager,
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

module.exports = router;

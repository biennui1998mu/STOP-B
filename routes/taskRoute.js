const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Task = require('../database/models/task');

//get task from plan
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
        _id : mongoose.Schema.Types.ObjectId,
        taskTitle : req.body.taskTitle,
        taskPara : req.body.taskPara
    });
    task.save()
        .then(result => {
            return res.status(200).json({
                message: 'created task successfully',
                createdTask: {
                    _id: result._id,
                    taskTitle: result.taskTitle,
                    // taskPara : req.body.taskPara
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



module.exports = router;

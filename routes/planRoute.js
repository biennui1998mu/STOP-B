const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

const Plan = require('../database/models/plan');
const Task = require('../database/models/task');

// Take all from list
router.get('/', checkAuth, (req, res, next) => {
    Plan.find()
        .select('planTitle planTaskID planPriority planDate planMember _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                plans: docs.map(doc => {
                    return {
                        id: doc._id,
                        title: doc.planTitle,
                        taskID: doc.planTaskID,
                        priority: doc.planPriority,
                        date: doc.planDate,
                        member: doc.planMember,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/plans/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

// Search by ID
router.get('/:planId', checkAuth, (req, res, next) => {
    res.status(200).json({
        message: "Plan detail!",
        planId: req.params.planId
    })
});

// Create plan
router.post('/', checkAuth, (req, res, next) => {
    const plan = new Plan({
        _id: new mongoose.Types.ObjectId(),
        planTitle: req.body.planTitle,
        planTaskID: req.body.planTaskID,
        planPriority: req.body.planPriority,
        planDate: req.body.planDate,
        planMember: req.body.planPriority
    });
    plan.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'plan has been created',
                createdPlan: {
                    id: result._id,
                    title: result.planTitle,
                    taskID: result.planTaskID,
                    priority: result.planPriority,
                    date: result.planDate,
                    member: result.planMember,
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/plans/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    res.status(201).json({
        message: "plans post",
        createdPlan : plan
    })
});

router.patch('/:planId', checkAuth, (req, res, next) => {
    const id = req.params.planId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propTitle] = ops.value;
        updateOps[ops.propPriority] = ops.value;
    }
    Plan.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Plan updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/plans/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Error: err
            })
        });
});

router.delete('/:planId', checkAuth, (req, res, next) => {
    const id = req.params.planId;
    Plan.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Plan was deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/plans',
                    body: {
                        noteTitle: 'String',
                        notePriority: 'Boolean'
                    }
                }
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

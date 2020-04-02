const express = require('express');
const router =  express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

const Plan = require('../database/models/plan');
const Task = require('../database/models/task');

// Take all from list
router.get('/', checkAuth, (req, res, next) => {
    Plan.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                plans: docs.map(doc => {
                    return {
                        _id: doc._id,
                        planTitle: doc.planTitle,
                        planTaskID: doc.planTaskID,
                        planPriority: doc.planPriority,
                        planDate: doc.planDate,
                        planMember: doc.planMember,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/plans/' + doc._id
                        }
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

// Search by ID
router.post('/view', checkAuth, (req, res, next) => {
    const id = req.body.planId;
    if(!id) {
        // ... xu ly validate
    }
    Plan.findById(id)
        .populate(['planTaskID'])
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if(doc) {
                return res.status(200).json({
                    plan: doc,
                    request: {
                        type: 'GET',
                        // description: 'Get all notes',
                        url: 'http://localhost:3000/plans/'
                    }
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

// Create plan
router.post('/createPlan', checkAuth, (req, res, next) => {
    const plan = new Plan({
        _id: new mongoose.Types.ObjectId(),
        planTitle: req.body.planTitle,
        planTaskID: new mongoose.Types.ObjectId(),
        planPriority: req.body.planPriority,
        planDate: req.body.planDate,
        planMember: req.body.planMember
    });
    plan.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'plan has been created',
                createdPlan: {
                    _id: result._id,
                    planTitle: result.planTitle,
                    planTaskID: result.planTaskID,
                    planPriority: result.planPriority,
                    planDate: result.planDate,
                    planMember: result.planMember,
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
});

//Search by string
router.post('/search', (req, res) => {
    const getTitle = req.body.planTitle;

    if(getTitle.length < 2){
        return res.json({
            message: 'Must be at least 2 character'
        })
    }else{
        Plan.find({
            planTitle : new RegExp(getTitle)
        }, function (err, plans) {
            if(plans){
                return res.json(plans);
            }else{
                return err;
            }
        }).limit(10)
    }
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

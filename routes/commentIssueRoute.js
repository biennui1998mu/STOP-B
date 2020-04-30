const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const checkAuth = require('../middleware/check-auth');
const checkProject = require('../middleware/check-project');
const checkTask = require('../middleware/check-task');

const CommentIssue = require('../database/models/commentIssue');

/**
 * get all messages in one task
 */
router.post('/all', checkAuth, checkProject, checkTask, (req, res) => {
    const taskData = req.taskData;

    CommentIssue.find({
        task: taskData._id,
    }).sort(
        '+createdAt'
    ).populate(
        'task createdBy'
    ).exec().then(resolve => {
        return res.status(200).json({
            message: 'Messages retrieved.',
            data: resolve
        });
    }).catch(error => {
        return res.status(200).json({
            message: 'Messages retrieve failed. An error occurred while querying',
            data: [],
            error: error,
        });
    });
});

/**
 * create a new comment
 */
router.post('/create', checkAuth, checkProject, checkTask, (req, res) => {
    const taskData = req.taskData;
    const userId = req.userData._id.toString();
    const {content} = req.body;

    if (!content || typeof content !== 'string' || content.length === 0) {
        return res.status(301).json({
            data: null,
            message: 'Missing content',
        });
    }

    const newComment = new CommentIssue({
        content: content,
        task: taskData._id,
        createdBy: userId,
    });

    newComment.save().then(result => {
        return res.status(200).json({
            message: 'Created comment successfully',
            data: result,
        })
    }).catch(error => {
        return res.status(200).json({
            message: 'Create comment failed.',
            data: null,
            error: error
        });
    })
});

/**
 * update a comment.
 */
router.post('/update', checkAuth, checkProject, checkTask, async (req, res) => {
    const taskData = req.taskData;
    const userId = req.userData._id.toString();
    const {id, content} = req.body;

    if (!content || typeof content !== 'string' || content.length === 0) {
        return res.status(301).json({
            data: null,
            message: 'Missing content',
        });
    }

    if (!id) {
        return res.status(301).json({
            data: null,
            message: 'Missing identification',
        });
    }
    let userComment = null;

    try {
        userComment = await CommentIssue.findOne({
            _id: id,
            createdBy: userId,
            task: taskData._id
        }).exec();
    } catch (e) {
        return res.status(500).json({
            data: null,
            message: 'Comment was not able find',
            error: e,
        });
    }

    if (!userComment) {
        return res.status(404).json({
            data: null,
            message: 'Comment not found',
        });
    }

    userComment.content = content;
    userComment.updatedAt = Date.now();

    try {
        await userComment.save();
        return res.json({
            data: userComment,
            message: 'Updated the comment',
        });
    } catch (e) {
        return res.status(500).json({
            data: null,
            message: 'Comment was not able to be updated',
            error: e,
        });
    }
})

module.exports = router;

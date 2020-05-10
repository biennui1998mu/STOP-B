const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

const Note = require('../database/models/note');

// Take all notes from list
router.post('/', checkAuth, (req, res) => {
    Note.find({user: req.userData._id.toString()})
        .populate('project user')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                notes: docs
            };
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

// Take note from db by ID
router.post('/view', (req, res) => {
    const id = req.body.noteId;
    if (!id) {
        // ... xu ly validate
    }
    Note.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                return res.status(200).json({
                    note: doc,
                });
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

    if (input.length < 2) {
        return res.json({
            message: 'Must be at least 2 character'
        })
    } else {
        Note.find({
            $or: [
                {title: new RegExp(input, 'i')},
                {description: new RegExp(input, 'i')}
            ]
        }, function (err, notes) {
            if (notes) {
                return res.json(notes);
            } else {
                return err;
            }
        }).limit(10);
    }
});

// Create new note
router.post('/create', checkAuth, (req, res) => {
    const note = new Note({
        _id: new mongoose.Types.ObjectId(),
        user: req.userData._id.toString(),
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        project: req.body.project
    });
    note.save()
        .then(result => {
            console.log(result);
            return res.status(200).json({
                message: "Created note successfully",
                createdNote: {
                    _id: result._id,
                    title: result.title,
                    user: result.user,
                    description: result.description,
                    priority: result.priority,
                    createdAt: result.createdAt,
                    project: result.project
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
router.post('/update/:noteId', (req, res) => {
    const id = req.params.noteId;
    const updateOps = {...req.body};

    console.log(updateOps);

    Note.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            return res.status(200).json({
                message: 'Note updated',
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                error: err
            });
        });
});

// Delete note by ID
router.post('/delete/:noteId', (req, res) => {
    const id = req.params.noteId;
    Note.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Note was deleted',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            })
        });
});

module.exports = router;

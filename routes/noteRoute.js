const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

const Note = require('../database/models/note');

// Take all notes from list
router.post('/', checkAuth, (req, res) => {
    Note.find({noteUserId : req.userData.userId})
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                notes: docs.map(doc => {
                    return {
                        _id: doc._id,
                        noteTitle: doc.noteTitle,
                        noteUserId: doc.noteUserId,
                        noteDescription: doc.noteDescription,
                        notePriority: doc.notePriority,
                        noteStartDate: doc.noteStartDate,
                        noteStatus: doc.noteStatus,
                        noteProjectId: doc.noteProjectId,
                    }
                })
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

    if(input.length < 2){
        return res.json({
            message: 'Must be at least 2 character'
        })
    }else{
        Note.find({
            $or: [
                {noteTitle: new RegExp(input)},
                {noteDescription: new RegExp(input)}
            ]
        }, function (err, notes) {
            if(notes){
                return res.json(notes);
            }else{
                return err;
            }
        }).limit(10);
    }
});

// Create new note
router.post('/create', (req, res) => {
    const note = new Note({
        _id: new mongoose.Types.ObjectId(),
        noteUserId: req.body.noteUserId,
        noteTitle: req.body.noteTitle,
        noteDescription: req.body.noteDescription,
        notePriority: req.body.notePriority,
        noteStartDate: Date.now(),
        noteProjectId: req.body.noteProjectId
    });
    note.save()
        .then(result => {
            console.log(result);
            return res.status(200).json({
                message: "Created note successfully",
                createdNote: {
                    _id: result._id,
                    noteTitle: result.noteTitle,
                    noteUserId: result.noteUserId,
                    noteDescription: result.noteDescription,
                    notePriority: result.notePriority,
                    noteStartDate: result.noteStartDate,
                    noteProjectId: result.noteProjectId
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
                Error: err
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
                Error: err,
            })
        });
});

module.exports = router;

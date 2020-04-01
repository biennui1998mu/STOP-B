const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

const Note = require('../database/models/note');

// Take all from list
router.get('/', checkAuth, (req, res, next) => {
    Note.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                notes: docs.map(doc => {
                    return {
                        _id: doc._id,
                        noteTitle: doc.noteTitle,
                        notePara: doc.notePara,
                        notePriority: doc.notePriority,
                        noteDate: doc.noteDate,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/notes/' + doc._id
                        }
                    }
                })
            };
            // if(doc.length > 0){
            res.status(200).json(response)
            // }else{
            //     res.status(404).json({
            //         message: 'There is no note that you can find'
            //     })
            // }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

// Search by ID
router.post('/view', checkAuth, (req, res, next) => {
    const id = req.body.noteId;
    if (!id) {
        // ... xu ly validate
    }
    Note.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                return res.status(200).json({
                    note: doc,
                    request: {
                        type: 'GET',
                        // description: 'Get all notes',
                        url: 'http://localhost:3000/notes/'
                    }
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

// Create note
router.post('/createNote', checkAuth, (req, res, next) => {
    const note = new Note({
        _id: new mongoose.Types.ObjectId(),
        noteTitle: req.body.noteTitle,
        notePara: req.body.notePara,
        notePriority: req.body.notePriority,
        noteDate: req.body.noteDate
    });
    note.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Created note successfully",
                createdNote: {
                    _id: result._id,
                    noteTitle: result.noteTitle,
                    notePara: result.notePara,
                    notePriority: result.notePriority,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/notes/' + result._id
                    }
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


router.patch('/:noteId', checkAuth, (req, res, next) => {
    const id = req.params.noteId;
    const updateOps = {...req.body};

    console.log(updateOps);

    Note.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            return res.status(200).json({
                message: 'Note updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/notes/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                Error: err
            });
        });
});

router.delete('/:noteId', checkAuth, (req, res, next) => {
    const id = req.params.noteId;
    Note.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Note was deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/notes',
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
                Error: err,
            })
        });
});

module.exports = router;

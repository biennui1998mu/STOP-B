const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const Note = require('../database/models/note');
const Project = require('../database/models/project');

// Take all notes from list
router.post('/', checkAuth, async (req, res) => {
    const userId = req.userData._id

    const listNote = await Note.find({user: userId})
        .populate('project user')
        .exec()

    if (!listNote) {
        return res.json({
            message: 'Find list note fail'
        })
    }

    return res.json({
        message: 'listNote founded',
        data: listNote
    })

});

/**
 * View note from db by ID
 */
router.post('/view', checkAuth, async (req, res) => {
    const noteId = req.body.noteId;

    if (!noteId) {
        return res.json({
            message: 'No valid id was found',
        });
    }

    const findNote = await Note.find({_id: noteId}).exec();

    if (!findNote) {
        return res.json({
            message: 'Cannot find any note',
        });
    }
    return res.json({
        message: 'Note founded',
        note: findNote,
    });
});

/**
 * Search by string
 */
router.post('/search', checkAuth, (req, res) => {
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

/**
 * Create new note
 */
router.post('/create', checkAuth, async (req, res) => {
    const userId = req.userData._id;
    const {title, description, priority, status} = req.body;

    const info = {
        user: userId,
        title,
        description,
        priority,
        status
    };

    if (req.body.project) {
        info.project = req.body.project;
    }

    try {
        const note = new Note(info);
        await note.save();
        const returnNote = await note.populate('project').execPopulate();
        return res.status(200).json({
            message: "Created note successfully",
            data: returnNote
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: e
        });
    }
});

/**
 * Update note by ID
 */
router.post('/update/:noteId', checkAuth, async (req, res) => {
    const id = req.params.noteId;

    const {title, description, project, priority, status} = req.body;

    if (req.body._id) {
        delete req.body._id;
    }
    if (req.body.createdAt) {
        delete req.body.createdAt;
    }
    if (req.body.user) {
        delete req.body.user;
    }

    try {
        const note = await Note.findOne({
            _id: id,
            user: req.userData._id
        }).exec();

        if (!note) {
            return res.status(404).json({
                message: 'Note not found',
            })
        }
        if (title && title.length > 0) {
            note.title = title;
        }
        if (description) {
            note.description = description;
        }
        if (project) {
            const projectFind = await Project.findOne({
                _id: project._id ? project._id : project,
                $or: [
                    {manager: req.userData._id.toString()},
                    {moderator: {$in: [req.userData._id.toString()]}},
                    {member: {$in: [req.userData._id.toString()]}},
                ]
            }).exec();
            if (!projectFind) {
                return res.status(301).json({
                    message: 'Project is not valid',
                })
            }
            note.project = projectFind._id;
        }
        if (priority !== undefined) {
            note.priority = priority;
        }
        if (status !== undefined) {
            note.status = status;
        }

        await note.save();
        const returnNote = await note.populate('project').execPopulate();
        return res.json({
            message: 'update successfully',
            data: returnNote
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: e
        });
    }
});

/**
 * Delete note by ID
 */
router.post('/delete/:noteId', checkAuth, async (req, res) => {
    const id = req.params.noteId;
    try {
        let findNote = await Note.findOne({
            _id: id,
            user: req.userData._id,
        }).exec();

        if (!findNote) {
            return res.status(404).json({
                message: 'Note not found.'
            });
        }

        findNote = await findNote.deleteOne();
        return res.json({
            message: 'deleted',
            data: findNote,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            error: e,
        })
    }
});

module.exports = router;

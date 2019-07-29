const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            author: req.user._id
        });
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.send(400).send(e);
    };
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt&order=desc
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};

    if(req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if(req.query.sortBy && req.query.order) {
        sort[req.query.sortBy] = req.query.order === 'desc' ? -1 : 1;
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            },
            sort
        }).execPopulate();
        res.send(req.user.tasks);
    } catch(e) {
        res.status(500).send();
    };
});

router.get('/tasks/:id', auth, async (req, res) => {    
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            author: req.user._id
        });

        if(!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch(e) {
       res.status(500).send();
    };
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({error: 'invalid fields'});
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            author: req.user._id
        });

        if(!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);
        task.save();
        res.send(task);
    } catch(e) {
        res.status(500).send();
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            author: req.user._id
        });
        
        if(!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch(e) {
        res.status(500).send();
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth');
const Project = require('../../models/Project');
const { db } = require('../../models/User');
const User = require('../../models/User');
// private routes

// post project
router.post('/', auth, [
    check('title', 'Title is Required').not().isEmpty(),
    check('requirements', 'Requirements is Required').not().isEmpty(),
    check('description', 'Description is Required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const user = await User.findById(req.user.id).select('-password')
        const newProject = new Project({
            title: req.body.title,
            name: user.name,
            description: req.body.description,
            requirements: req.body.requirements,
            avatar: user.avatar,
            user: req.user.id,
        })
        const project = await newProject.save();

        res.json(project)
    } catch (err) {
        res.status(500).send('Server Error')
    }
})

// get all projects 
router.get('/', auth, async (req, res) => {
    try {
        const projects = await Project.find().sort({ date: -1 })
        res.json(projects)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// get project by id
router.get('/user/:id', async (req, res) => {
    try {
        const project = await Project.findOne({ user: req.params.id })
        if (!project) {
            return res.status(404).json({ msg: 'Project not Found' })
        }
        res.json(project)
    } catch (err) {
        console.log(err)
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Project not Found' })
        }
        res.status(500).send('Server Error')
    }
})

// delete project by id
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)

        if (project.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User Not Authorized' })
        }

        await project.remove();
        res.json({ msg: 'Project removed' })

    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Project not Found' })
        }
        res.status(500).send('Server Error')
    }
})

// get all user projects
router.get('/:user_id', auth, async (req, res) => {
    try {
        const projects = await Project.find({ user: req.params.user_id }).sort({ date: -1 })
        res.json(projects)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

router.get('/search', auth, async (req, res) => {

})

module.exports = router
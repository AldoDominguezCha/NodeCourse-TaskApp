/* This file is the task router, it declares all the API endpoints for the CRUD operations
related to the task, it gets imported at the main script of the server. */
const express = require('express')
const Task = require('../models/task')
const authMiddleware = require('../middleware/authentication')

//Create the router
const router = new express.Router()

//Declare the API endpoints for the router

//Declare the endpoint to create a task using the POST method
router.post('/tasks', authMiddleware, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner : req.user._id
    });

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})



//Declare the endpoint to retrieve all tasks using the GET method
router.get('/tasks', authMiddleware, async (req, res) => {
    try {
//Populate the virtual 'tasks' attribute in user (Do the binding between entities, one to many user > task)
        const match = {}
        const sort = {}
        if(["true", "false"].includes(req.query.completed)) match.completed = req.query.completed === "true"
        if(req.query.sortBy){
            if(['createdAt', 'completed'].includes(req.query.sortBy.split(':')[0])) 
                sort[req.query.sortBy.split(':')[0]] = req.query.sortBy.split(':')[1] === 'desc' ? -1 : 1;
        } 
        await req.user.populate({
            path : 'tasks',
            match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            } 
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch(e) {
        res.status(500).send()
    }
})

//Declare the endpoint to retrieve one task by its ID object using the GET method
router.get('/tasks/:id', authMiddleware, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner : req.user._id })
        if(!task) return res.status(404).send()
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
})



//Declare the endpoint to update one task by its ID object using the PATCH method
router.patch('/tasks/:id', authMiddleware, async (req, res) => {
    const allowedUpdates = ['description', 'completed']
    const intendedUpdates = Object.keys(req.body)
    const validUpdate = intendedUpdates.every(
        (update) => allowedUpdates.includes(update)
    )
    if(intendedUpdates.length === 0) return res.status(400).send({error : "You must provide update values"})
    if(!validUpdate) return res.status(400).send({ error : 'You are trying to update a non-valid or non-existant property' })

    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner : req.user._id })
        if(!task) return res.status(404).send()
        intendedUpdates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


//Declare the endpoint to delete one task by its ID object using the DELETE method
router.delete('/tasks/:id', authMiddleware, async (req, res) => {
    const _id = req.params.id
    try {
        const deletedTask = await Task.findOneAndDelete({ _id, owner : req.user._id })
        if(!deletedTask) return res.status(404).send()
        res.status(200).send(deletedTask)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
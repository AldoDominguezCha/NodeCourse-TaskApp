/* This file is the user router, it declares all the API endpoints for the CRUD operations
related to the user, it gets imported at the main script of the server. */
const express = require('express')
const User = require('../models/user')

//Create the router
const router = new express.Router()

//Declare the API endpoints for the router

//Declare the endpoint to create an user using the POST method
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Declare the endpoint to retrieve all users using the GET method
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch(e) {
        res.status(500).send()
    }
})

//Declare the endpoint to retrieve one user by its ID object using the GET method
router.get('/users/:id', async (req, res) => {
    //Get the ID provided as a path parameter in the request
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if(!user) return res.status(404).send()
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send()
    }
    
})

//Declare the endpoint to update one user by its ID object using the PATCH method
router.patch('/users/:id', async (req, res) => {
    const intendedUpdates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const validUpdate = intendedUpdates.every(
        (update) => allowedUpdates.includes(update)
    )
    
    if(!validUpdate) return res.status(400).send({ error : 'You are trying to update a non-valid or non-existant property' })

    const _id = req.params.id
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, req.body, {new : true, runValidators : true})
        if(!updatedUser) return res.status(404).send()
        res.status(200).send(updatedUser)
    } catch (e) {
        res.status(400).send()
    }
})

//Declare the endpoint to delete one user by its ID object using the DELETE method
router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const deletedUser = await User.findByIdAndDelete(_id)
        if(!deletedUser) return res.status(404).send()
        res.status(200).send(deletedUser)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
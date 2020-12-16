/* This file is the user router, it declares all the API endpoints for the CRUD operations
related to the user, it gets imported at the main script of the server. */
const express = require('express')
const sharp = require('sharp')
const User = require('../models/user')
const {sendWelcomeEmail, sendCancellationEmail} = require('../email/account')
const authMiddleware = require('../middleware/authentication')
//Requiring and setting multer options to receive file uploads into our server
const multer = require('multer')
const uploadAvatar = multer({
    /* By not specifying multer the directory, it doesn't automatically save our files there
    instead we get access to the file in our route handler at 'req.file'  */
    //dest : 'avatars',
    limits : {
        fileSize : 1000000
    },
    fileFilter(req, file, cb) {
        if(file.originalname.match(/\.(jpg|jpeg|png)$/)) cb(undefined, true)
        else cb(new Error('Invalid file extension for the avatar'))
    }
})

//Create the router
const router = new express.Router()

//Declare the API endpoints for the router

/* Declare the endpoint to upload the profile picture using multer (Add form-data) to
express requests */
router.post('/users/me/avatar', authMiddleware , uploadAvatar.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width : 250, height : 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send('Avatar picture uploaded successfully')
}, (error, req, res, next) => {
    res.status(400).send({error : error.message})
})

/* Declare the endpoint to delete the user's profile picture */
router.delete('/users/me/avatar', authMiddleware, async (req, res) => {
    req.user.avatar = undefined
    try {
        await req.user.save()
        res.status(200).send('The profile avatar has been successfully deleted')
    } catch (e) {
        res.status(500).send(e)
    }
})


router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user.avatar) return res.status(404).send({error : 'No user or avatar found'})
        res.set('Content-Type', 'image/png')
        res.status(200).send(user.avatar)
    } catch (e) {
        res.status(500).send(e)
    }
})

//Declare the endpoint to create an user using the POST method
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateAuthToken()
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

//Append a new authorization token to the user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body)
        const token = await user.generateAuthToken()
        res.status(200).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

//Delete the provided authorization token from the tokens array of the user
router.post('/users/logout', authMiddleware, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(
            (token) => token.token !== req.token 
        )
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', authMiddleware, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send({ message : "All current sessions were successfully logged out" })
    } catch (e) {
        res.status(500).send(e)
    }
})

//Declare the endpoint to retrieve our particular user using the GET method
router.get('/users/me', authMiddleware , async (req, res) => {
    //We send back the user we found as a match in the middleware authentication function 'authMiddleware'
    res.send(req.user)
})

//Declare the endpoint to update one user by its ID object using the PATCH method
router.patch('/users/me', authMiddleware , async (req, res) => {
    const intendedUpdates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const validUpdate = intendedUpdates.every(
        (update) => allowedUpdates.includes(update)
    )
    if(intendedUpdates.length === 0) return res.status(400).send({error : "You must provide update values"})
    if(!validUpdate) return res.status(400).send({ error : 'You are trying to update a non-valid or non-existant property' })

    try {
        intendedUpdates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Declare the endpoint to delete one user by its ID object using the DELETE method
router.delete('/users/me', authMiddleware , async (req, res) => {
    try {
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
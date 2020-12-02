//Importing express module
const express = require('express')
//Running the mongoose connection script to the database in the MongoDB instance
require('./db/mongooseConnection')
//Importing our User and Task mongoose models
const User = require('./models/user')
const Task = require('./models/task')

//Set the express service
const app = express()
//Read the port from the env variables (for Heroku deployment) 
//or set it as 3000 as a fallback condition (local environment)
const port = process.env.PORT || 3000

//Automatically parse incoming JSON into an object
app.use(express.json())

//Declare the endpoint to create an user using the POST method
app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save().then(() => {
        //If we can successfully save the given user to the database, we send back the entire object
        res.status(201).send(user)
    }).catch((e) => {
        //If we can't save the given user to the database, we send a 400 status back and the
        //error object from mongoose, we are cahining methods to 'res' (response)
        res.status(400).send(e)
    })
})

//Declare the endpoint to create a task using the POST method
app.post('/tasks', (req, res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        //If we can successfully save the given task to the database, we send back the entire object
        res.status(201).send(task)
    }).catch((e) => {
        //If we can't save the given task to the database, we send a 400 status back and the
        //error object from mongoose, we are cahining methods to 'res' (response)
        res.status(400).send(e)
    })
})

//Declare the endpoint to retrieve all users using the GET method
app.get('/users', (req, res) => {
    //Attempt to fecth all available users, we leave the query object empty for this, it returns 
    //a promise
    User.find({}).then((users) => {
        //Send back the array of user objects
        res.status(200).send(users)
    }).catch((e) => {
        //Just send the 500 error status
        res.status(500).res.send()
    })
})

//Declare the endpoint to retrieve one user by its ID object using the GET method
app.get('/users/:id', (req, res) => {
    //Get the ID provided as a path parameter in the request
    const _id = req.params.id
    User.findById(_id).then((user) => {
        //If we don't find that user in the DB
        if(!user) return res.status(404).send()
        res.status(200).send(user)
    }).catch((e) => {
        res.status(500).send()
    })
})

//Declare the endpoint to retrieve all tasks using the GET method
app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.status(200).send(tasks)
    }).catch((e) => {
        res.status(500).send()
    })
})

//Declare the endpoint to retrieve one task by its ID object using the GET method
app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id
    Task.findById(_id).then((task) => {
        if(!task) return res.status(404).send()
        res.status(200).send(task)
    }).catch((e) => {
        res.status(500).send()
    }) 
})

//Start the server, it will be listening for petitions at the given port
app.listen(port, () => {
    console.log('The server is up and running')
})
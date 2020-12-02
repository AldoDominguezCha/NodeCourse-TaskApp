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
        res.send(user)
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
        res.send(task)
    }).catch((e) => {
        //If we can't save the given task to the database, we send a 400 status back and the
        //error object from mongoose, we are cahining methods to 'res' (response)
        res.status(400).send(e)
    })
})

//Start the server, it will be listening for petitions at the given port
app.listen(port, () => {
    console.log('The server is up and running')
})
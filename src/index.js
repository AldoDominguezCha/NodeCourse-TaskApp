//Importing express module
const express = require('express')
//Running the mongoose connection script to the database in the MongoDB instance
require('./db/mongooseConnection')
//Importing our User mongoose model
const User = require('./models/user')

//Set the express service
const app = express()
//Read the port from the env variables (for Heroku deployment) 
//or set it as 3000 as a fallback condition (local environment)
const port = process.env.PORT || 3000

//Automatically parse incoming JSON into an object
app.use(express.json())

app.post('/users', (req, res) => {
    res.send(req.body)
})

//Start the server, it will be listening for petitions at the given port
app.listen(port, () => {
    console.log('The server is up and running')
})
//Importing express module
const { response } = require('express')
const express = require('express')

//Set the express service
const app = express()
//Read the port from the env variables (for Heroku deployment) 
//or set it as 3000 as a fallback condition (local environment)
const port = process.env.PORT || 3000

app.post('/users', (req, res) => {
    res.send('Testing!')
})

//Start the server, it will be listening for petitions at the given port
app.listen(port, () => {
    console.log('The server is up and running')
})
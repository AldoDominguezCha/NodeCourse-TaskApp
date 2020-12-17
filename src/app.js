//Importing express module
const express = require('express')
//Running the mongoose connection script to the database in the MongoDB instance
require('./db/mongooseConnection')
//Importing our User and Task routers (CRUD API endpoints definitions)
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

//Set the express service
const app = express()

//Automatically parse incoming JSON into an object
app.use(express.json())

//Loading our User and Task routers (CRUD API endpoints definitions) for the server
app.use(userRouter)
app.use(taskRouter)

/* Exporting the app object for index.js to run the server and for the Jest test scripts
which will use the 'supertest' npm module that is used to make requests to a express server,
supertest doesn't actually need a running express server, it just needs the app object
to perform requests on its defined routes and we'll be asserting the results 
inside Jest test cases */
module.exports = app
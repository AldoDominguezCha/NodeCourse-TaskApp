//Importing express module
const express = require('express')
//Running the mongoose connection script to the database in the MongoDB instance
require('./db/mongooseConnection')
//Importing our User and Task routers (CRUD API endpoints definitions)
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

//Set the express service
const app = express()
/* Read the port from the PORT env variable, which will 
contain a different value depending on the computer on
which the script is executed (prod -> Heroku or dev -> Our computer) */
const port = process.env.PORT



//Automatically parse incoming JSON into an object
app.use(express.json())

//Loading our User and Task routers (CRUD API endpoints definitions) for the server
app.use(userRouter)
app.use(taskRouter)

//Start the server, it will be listening for petitions at the given port
app.listen(port, () => {
    console.log(`The server is up and running at port ${port}`)
})

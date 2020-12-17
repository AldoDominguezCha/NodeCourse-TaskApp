//Importing the express app object we defined in app.js
const app = require('./app')

/* Read the port from the PORT env variable, which will 
contain a different value depending on the computer on
which the script is executed (prod -> Heroku or dev -> Our computer) */
const port = process.env.PORT

//Start the server, it will be listening for petitions at the given port
app.listen(port, () => {
    console.log(`The server is up and running at port ${port}`)
})

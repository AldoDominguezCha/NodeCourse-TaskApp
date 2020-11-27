
//Importing the installed mongodb driver and storing the module's client inside a constant
//This two lines could be rewritten as "const MongoClient = require('mongodb').MongoClient"
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

//Importing assert from Mocha to stop the script when an assertion fails
const assert = require('assert')

//Identify the MongoDB DBMS instance to which we want to connect
//Communication protocol mongoDB <-> Node.js (mongodb://) -> This is the standard one
//IP address (127.0.0.1 -> 'localhost') and port (27017 -> The default used by MongoDB DBMS) 
const connectionURL = 'mongodb://127.0.0.1:27017'
//Name of the database we want to access in our MongoDB instance
const databaseName = 'task-app' 

MongoClient.connect(connectionURL, {useUnifiedTopology : true}, (error, client) => {
    //Mocha assertoon to make sure the connect callback function is not being 
    //invoked with an error, meaning the connection is successful, otherwise the 
    //script stops at this line
    assert.strictEqual(null, error)
    //If the prior assertion is successful, it means the connection to the database came along nicely
    console.log('Successful connection to the database!')
})
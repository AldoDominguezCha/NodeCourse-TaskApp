
//Importing the installed mongodb driver and storing the module's client inside a constant
//This two lines could be rewritten as "const MongoClient = require('mongodb').MongoClient"

/* -- CODE -- const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient */

//Get the ObjectID object from de mongodb module to performs operations 
//with ObjectID (collection's documents IDs) objects

/* -- CODE -- const ObjectID = mongodb.ObjectID */

//We change the previous module importing syntax, we deconstruct the object we get from
//"require('mongodb')"
const {MongoClient, ObjectID} = require('mongodb')

//Importing assert from Mocha to stop the script when an assertion fails
const assert = require('assert')

//Identify the MongoDB DBMS instance to which we want to connect
//Communication protocol mongoDB <-> Node.js (mongodb://) -> This is the standard one
//IP address (127.0.0.1 -> 'localhost') and port (27017 -> The default used by MongoDB DBMS) 
const connectionURL = 'mongodb://127.0.0.1:27017'
//Name of the database we want to access in our MongoDB instance
const databaseName = 'task-app' 

//Create a new instance of the ObjectID class
const id = new ObjectID()

const dropTables = false

MongoClient.connect(connectionURL, {useUnifiedTopology : true}, (error, client) => {
    //Mocha assertoon to make sure the connect callback function is not being 
    //invoked with an error, meaning the connection is successful, otherwise the 
    //script stops at this line
    assert.strictEqual(null, error)
    //If the prior assertion is successful, it means the connection to the mongoDB instance came along nicely
    console.log('Successful connection to the database!')
    //Get the reference for the database in the mongoDB instance to which we have just stablished 
    //connection, if the database doesn't exist, it gets created automatically
    const db = client.db(databaseName)
    //Get the collection (equivalent to a table for regular SQL) inside de database
    //if it doesn't exist already, it's automatically created, and we insert a new document (object)
    //in this collection. insertOne is asynchronous, so we can optionally provide a callback
    //function for when the operation is finished or failed.
    db.collection('users').insertOne({
        _id : id,
        name : 'Aldo',
        age : 24
    }, (error, result) => {
        assert.strictEqual(error, null)
        console.log(result.ops)
    })
    //Insert multiple documents into the collection at the same time
    db.collection('users').insertMany([
        {
            name : 'Jen',
            age : 22
        },
        {   
            name : 'Ghunter',
            age : 19
        }
    ], (error, result) => {
        assert.strictEqual(error, null)
        console.log(result.ops)
        console.log(result.insertedIds)
    })
    //Create another collection (equivalent to a table) called tasks with some
    //documents (equivalent to rows or registries)
    db.collection('tasks').insertMany([
        {
            description : 'Finish node course unit',
            completed : false
        },
        {
            description : 'Update GitHub repo',
            completed : true
        },
        {
            description : 'Create new project',
            completed : true
        }
    ], (error, result) => {
        assert.strictEqual(null, error)
        console.log(result.ops)
        
        if(dropTables){
            //Drop (delete) users collection to not accumulate test data
            db.collection('users').drop((error, result) => {
                assert.strictEqual(null, error)
                console.log('users collection dropped from the database')
            })
            //Drop (delete) tasks collection to not accumulate test data
            db.collection('tasks').drop((error, result) => {
                assert.strictEqual(null, error)
                console.log('tasks collection dropped from the database')
                client.close()
            })
        }
        if(!dropTables)
            client.close()

    })


})

console.log(id.toString().length)
console.log(id.getTimestamp())
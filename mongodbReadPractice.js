const {MongoClient, ObjectID} = require('mongodb')
const assert = require('assert')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-app'

MongoClient.connect(connectionURL, {useUnifiedTopology : true}, (error, client) => {
    assert.strictEqual(null, error)
    const db = client.db(databaseName)
    //Storing our users collection reference in a constant since we'll use it multiple times
    const usersCollection = db.collection('users')
    //Fetching one document from the users collection, the first one which name matches
    //'Jen' AND which age also matches the value 22
    usersCollection.findOne({ name : 'Jen', age : 22}, (error, result) => {
        assert.strictEqual(null, error)
        console.log(result)
    })
    //Looking for a document providing its idObject, we cant just pass the id string,
    //we need to create a new idObject with it
    usersCollection.findOne({ _id : new ObjectID('5fc1a1970a1a273a044bf522') }, (error, result) => {
        assert.strictEqual(null, error)
        console.log(result)
    })
    const tasksCollection = db.collection('tasks')
    //Fetching multiple documents with one query, we get back a cursor (pointer in the DB), 
    //not an array of the found documents, we need to further manipulate that cursor,
    //here we just get the count of the documents that the cursor contains
    tasksCollection.find({ completed : true }).count((error, count) => {
        assert.strictEqual(null, error)
        console.log(`Matching documents found with the find query: ${count}.`)
    })
    //Fetching multiple documents and processing the cursor (location pointer) we get
    //to obtain the array of matching documents using the 'toArray' method of the cursor
    tasksCollection.find({ completed : true }).toArray((error, documents) => {
        console.log(documents)
    })
})



const assert = require('assert')
//Using destructuring
const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-app'
//From now on we use the promise returned by the 'connect' method of the
//MongoClient class, instead of providind a callback function, since using
//promises is more efficient in design.
const connectionPromise = MongoClient.connect(connectionURL, {useUnifiedTopology : true});
//We attach the reject function to the promise
connectionPromise.catch((error) => {
    console.log('Error: The connection to the MongoDB instance could not be stablished')
})
//We attach the solve function to the promise
connectionPromise.then((client) => {
    const db = client.db(databaseName)
    const tasksCollection = db.collection('tasks')
    tasksCollection.find({}).count().then((number) => {
        console.log(`Number of task documents found: ${number}.`)
    })
    //We use the deleteOne method on the collection to erase a document by its ID (remember to create 
    // new ObjectID object for this), then we attach the solve function to the promise we get, it seems
    //that even if the document is not deleted because it previously was, the promise still gets solved,
    //but the 'deletedCount' property in the result tells us if somethin was actually deleted.
    tasksCollection.deleteOne({ _id : new ObjectID('5fc1a1970a1a273a044bf526') })
    .then((result) => {
        console.log(`Number of documents deleted -> deletedCount : ${result.deletedCount}.`)
    });
    //Deleting multiple user documents at once, all the documents which 'age' field is equal to 22,
    //just like with deleteOne, even if no document to delete is found, the promise still gets solved
    //so we only need to attach a solve function with the '.then()' method.
    const usersCollection = db.collection('users')
    usersCollection.deleteMany({ age : 22 })
    .then((result) => {
        console.log(`Number of documents deleted -> deletedCount : ${result.deletedCount}.`)
    })

})

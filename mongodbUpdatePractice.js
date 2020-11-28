const assert = require('assert') 
const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-app'

MongoClient.connect(connectionURL, {useUnifiedTopology : true}, (error, client) =>{
    assert.strictEqual(null, error)
    const db = client.db(databaseName)

    const usersCollection = db.collection('users')
    //Updating just one dicument inside the users collection, updateOne returns a promise
    //so we attach to it the resolve function (then) and the reject function (catch)
    usersCollection.updateOne({ 
        name : 'Updated' 
    }, { 
        $set : {
            name : 'Aldo',
            age : 24
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)})
    //Using a different update operator ($inc : { ... }) to increment the age value by one
    //of a document inside the users collection
    usersCollection.updateOne({ 
        name : 'Aldo'
    }, {
        $inc : {
            age : 1
        }
    }).then((result) => {
        console.log('Successfully incremented with updateOne!')
    }).catch((error) => {
        console.log('Error incrementing the value in the document!')
    })
    //Renaming a document's age field using the $rename update operator
    usersCollection.updateOne({
        _id : new ObjectID('5fc1a862ce09fa54d436e27c')
    }, {
        $rename : {
            age : 'years'
        }
    }).then((result) => {
        console.log('Successfully renamed the field!')
    }).catch((error) => {
        console.log('Error renaming the field!')
    })
    //Update many documents inside the tasks collection
    const tasksCollection = db.collection('tasks')
    tasksCollection.updateMany({
        completed : true
    }, {
        $set : {
            completed : false
        }
    }).then((result) => {
        console.log('Tasks status updated successfully!')
    }).catch((error) => {
        console.log('Tasks status updating failed!')
    })

})
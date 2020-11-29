//Import our mongoose module, its an ODM (Object Document Modeling) to more easily translate our
//Node.js entities into MongoDB documents, with proper data validations and so on. 
//It's an ORM for MongoDB.
const mongoose = require('mongoose')
//Connection URL for mongoose to stablish connection with the MongoDB instance
//ans the specific database:
//Communication protocol (mongodb://) + IP address and Port (127.0.0.1:27017) + database name (task-app)
const connectionURL = 'mongodb://127.0.0.1:27017/mongoose-task-app'
//Connect mongoose to the MongoDB instance and its specified database
mongoose.connect(connectionURL,
    {
        useUnifiedTopology : true,
        useNewUrlParser : true
    })
.then(() => {
    console.log('Connection between mongoose and the database in the MongoDB instance was successful')
}).catch((error) => {
    console.log('Unable to connect to the database and/or MongoDB instance from mongoose')
})
//Create a new mongoose model called user, with two fields for each document (instance), and
//we specify the data type we require when creating a new instance (document) of this model.
const User = mongoose.model('User', {
    name : {
        type : String
    },
    age : {
        type : Number
    }
})
//Instantiate the model with specific values
const me = new User({
    name : 'AldoDev',
    age : 24
})
//Save the instnace of the model (document) to the database in the MongoDB instance
me.save().then((modelInstance) => {
    console.log('Saved!', modelInstance)
}).catch((error) => {
    console.log('Error!', error)
})
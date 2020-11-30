//Import our mongoose module, its an ODM (Object Document Modeling) to more easily translate our
//Node.js entities into MongoDB documents, with proper data validations and so on. 
//It's an ORM for MongoDB.
const mongoose = require('mongoose')
//Import the data validator module for our models and documents
const validator = require('validator')
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
        type : String,
        required : true,
        trim : true
    },
    age : {
        type : Number,
        required : true,
        trim : true,
        //Validating the data with a function of our own, instead we could choose to use a 
        //robust npm package specifically designed por this purpose (npm validator) 
        validate(value){
            if(value < 0) throw new Error('The age must be a positive number')
        }
    },
    email : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error('The provided email is not valid')
        }
    },
    password : {
        type : String,
        minlength : 7,
        trim : true,
        validate(value){
            if(value.toLowerCase().includes('password')) throw new Error('Invalid password')
        }
    }
})


//Instantiate the model with specific values
const me = new User({
    name : '   AldoDev    ',
    age : 0,
    email : 'MAIL@MAIL.COM   ',
    password : '  test123 '
})


//Save the instnace of the model (document) to the database in the MongoDB instance
/* me.save().then((modelInstance) => {
    console.log('Saved!', modelInstance)
}).catch((error) => {
    console.log('Error!', error)
}) */

//Create a model for the tasks documents
const Task = mongoose.model('Task', {
    description : {
        type : String,
        required : true,
        trim : true 
    },
    completed : {
        type : Boolean,
        default : false
    }
})

//Create a new instance of the task model (document)
const learnTask = new Task({
    description : '   Learn mongoose integration with Node.js  '
})
//Save the instance of the model (document)
learnTask.save().then((modelInstance) => {
    console.log('Saved!', modelInstance)
}).catch((error) => {
    console.log('Error!', error)
})

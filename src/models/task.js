//Import the mongoose and validator modules, validator is not currently in use, but I
//added just in case this model gets expanded
const mongoose = require('mongoose')
const validator = require('validator')

//Creating the mongoose Task model
const Task = mongoose.model('Task', {
    description : {
        type : String,
        required : true,
        trim : true 
    },
    completed : {
        type : Boolean,
        default : false
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
})

//Export the Task model
module.exports = Task
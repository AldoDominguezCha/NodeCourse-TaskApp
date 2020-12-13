//Import the mongoose and validator modules, validator is not currently in use, but I
//added just in case this model gets expanded
const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
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
}, {
    timestamps : true
})

//Creating the mongoose Task model
const Task = mongoose.model('Task', taskSchema)

//Export the Task model
module.exports = Task
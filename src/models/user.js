//Import mongoose and validator npm modules
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const { response } = require('express')

//Creating the mongoose schema needed to declare the user model
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    age : {
        type : Number,
        default : 18,
        //Validating the data with a function of our own, instead we could choose to use a 
        //robust npm package specifically designed por this purpose (npm validator) 
        validate(value){
            if(value < 0) throw new Error('The age must be a positive number')
        }
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error(`Your password can't contain the word "password"!`)
        }
    },
    password : {
        type : String,
        required : true,
        minlength : 7,
        trim : true,
        validate(value){
            if(value.toLowerCase().includes('password')) throw new Error('Invalid password')
        }
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    }
}, {
    timestamps : true
})

/* Creating a virtual property on the user schema, one that 'contains' all the user's tasks,
we need to specify which model we are referring to (Task) and the local and foreign key
that bind the two entities together */
userSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})


userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id : this._id.toString() }, process.env.JWT_SECRET)
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
}

userSchema.methods.toJSON = function() {
    const user = this.toObject()
    delete user.password
    delete user.tokens
    delete user.__v
    delete user.avatar
    return user
}

//Declaring a pre hook for the ".save()" method in user, to hash the password provided
userSchema.pre('save', async function(next) {
    const user = this
    /* Only hash the password if the password was modified or set for the first time,
    always doing it would be a great mistake */
    if(user.isModified('password')) user.password = await bcrypt.hash(user.password, 8)
    next();
})

/* Declaring a pre hook for the ".remove()" method in user, to delete all tasks
associated to that user */
userSchema.pre('remove', async function(next) {
    await Task.deleteMany({ owner : this._id })
    next()
})


//Log in function appended to the schema for the User model
userSchema.statics.findByCredentials = async ({email, password}) => {
    const user = await User.findOne({ email })
    if(!user) throw new Error('The email provided is not associated to any user')
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) throw new Error('Invalid password')
    return user
}


//User mongoose model
const User = mongoose.model('User', userSchema)

module.exports = User
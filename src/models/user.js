//Import mongoose and validator npm modules
const mongoose = require('mongoose')
const validator = require('validator')

//User mongoose model
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
    }
})

module.exports = User
/* This module was created as a set up script to populate the test database, it was structured 
this way since both test suites (user and task) need a fresh user to be created in the beforeEach 
Jest hook for all the authenticated endpoints in the APIs. So, now we have this generic set up available 
for both suites ready to use when imported
 */
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneID = new mongoose.Types.ObjectId()

const userOne = {
    _id : userOneID,
    name : "First Test User",
    email : "test1@example.com",
    password : "roadnet123",
    tokens : [{
        token : jwt.sign({ _id : userOneID.toString() }, process.env.JWT_SECRET)
    }]
}


const userTwoID = new mongoose.Types.ObjectId()

const userTwo = {
    _id : userTwoID,
    name : "Second Test User",
    email : "test2@example.com",
    password : "roadnet123",
    tokens : [{
        token : jwt.sign({ _id : userTwoID.toString() }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id : new mongoose.Types.ObjectId(),
    description : 'First test task',
    completed : false,
    owner : userOne._id
} 

const taskTwo = {
    _id : new mongoose.Types.ObjectId(),
    description : 'Second test task',
    completed : true,
    owner : userOne._id
}

const taskThree = {
    _id : new mongoose.Types.ObjectId(),
    description : 'Third test task',
    completed : true,
    owner : userTwo._id
} 

const populateDataBase = async () => {
    try {
        await Task.deleteMany()
        await User.deleteMany()
        await new User(userOne).save()
        await new User(userTwo).save()
        await new Task(taskOne).save()
        await new Task(taskTwo).save()
        await new Task(taskThree).save()
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    populateDataBase
}
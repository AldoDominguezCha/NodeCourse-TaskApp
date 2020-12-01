const mongoose = require('mongoose')

const connectionURL = 'mongodb://127.0.0.1:27017/mongoose-task-app'

const mongooseConnectionPromise = mongoose.connect(connectionURL, {
    useUnifiedTopology : true,
    useNewUrlParser : true
})

mongooseConnectionPromise.then(() => {
    console.log('Connection between mongoose and the database in the MongoDB instance was successful')
}).catch((error) => {
    console.log('Unable to connect to the database and/or MongoDB instance from mongoose')
})
const mongoose = require('mongoose')

const mongooseConnectionPromise = mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology : true,
    useNewUrlParser : true,
    useFindAndModify : false
})

mongooseConnectionPromise.then(() => {
    console.log('Connection between mongoose and the database in the MongoDB instance was successful')
}).catch((error) => {
    console.log('Unable to connect to the database and/or MongoDB instance from mongoose')
})
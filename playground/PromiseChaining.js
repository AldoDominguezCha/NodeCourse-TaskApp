require('../src/db/mongooseConnection')
const User = require('../src/models/user')

User.findByIdAndUpdate('5fc6738ace1f542f8474d4af', {age : 18}).then((user) => {
    return User.find({age: 18})
}).then((users) => {
    console.log(users)
}).catch((e) => {
    console.log(e)
})

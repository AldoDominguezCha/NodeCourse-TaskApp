require('../src/db/mongooseConnection')
const Task = require('../src/models/task')

Task.findByIdAndDelete('5fc6fb79ffc3086180d76151').then((task) => {
    console.log(task)
    return Task.find({ completed : true })
}).then((completed) => {
    console.log('+++++++++++++++++++++++++++')
    console.log(completed)
    return Task.count({ completed : true })
}).then((number) => {
    console.log('************************')
    console.log(number)
})
.catch((e) => {
    console.log(e)
})
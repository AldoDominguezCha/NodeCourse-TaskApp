require('../src/db/mongooseConnection')
const User = require('../src/models/user')
const Task = require('../src/models/task')

const age = 18

const updateAgeAndCount = async (id, age) => {
    await User.findByIdAndUpdate(id, { age })
    const count = User.countDocuments({ age })
    return count
}

updateAgeAndCount('5fc6738ace1f542f8474d4af', age).then((count) => {
    console.log(`Users that are ${age} years old after the change: ${count}`)
}).catch((e) => {
    console.log('Error', e)
})

const deleteTaskAndCount = async (id) => {
    const deletedTask = await Task.findByIdAndDelete(id)
    const remainingTasks = await Task.countDocuments({})
    const result = {
        deletedTask,
        remainingTasks
    }
    return result
}

deleteTaskAndCount('5fc6fcecfc4ba566bc648b34').then(({deletedTask, remainingTasks}) => {
    console.log(`The task that was deleted is: ${deletedTask}`)
    console.log(`Remaining tasks after deletion: ${remainingTasks}`)
}).catch((e) => {
    console.log('Error', e)
})

const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOne, userTwo, taskOne, taskTwo, taskThree, populateDataBase } = require('./fixtures/DataBaseTestSetUp')

beforeEach(populateDataBase)

test('Should create task for user', async () => {
    newTask = {
        description : 'Testing',
        completed : true
    }
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(newTask)
        .expect(201)
    expect(response.body).toMatchObject(newTask)
    expect(response.body.completed).toEqual(expect.any(Boolean))
    //Look for the recently created task
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task).toMatchObject(newTask)
})

test("Should return the user one tasks", async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
    expect(response.body).toEqual(expect.any(Array))
    expect(response.body).toHaveLength(2)
    expect(response.body).toMatchObject([{
        description : 'First test task',
        completed : false
    },
    {
        description : 'Second test task'
    }])
})


test("Shouldn't delete unrelated task", async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id.toString()}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(404)
    //Check that the task unrelated to the user is still in the DB
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
    expect(task).toMatchObject(taskOne)
})
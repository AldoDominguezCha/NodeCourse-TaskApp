const request = require('supertest')
const app = require('../src/app')

test('Should sign up a new user correctly', async () => {
    await request(app).post('/users').send({
        name : "Aldo Supertest",
        email : "aldodomchz@gmail.com",
        password : "roadnet123"
    }).expect(201)
})
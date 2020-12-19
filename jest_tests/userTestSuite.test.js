const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOne, populateDataBase } = require('./fixtures/DataBaseTestSetUp')

/* beforeEach Jest hook, it runs once before every Jest test, just like in Cypress, here we 
are deleting all pre-existing users in the database by not providing a matching object to
User.deleteMany, and then we create and save to the database our first test user for each
test suite run, we have connection to our test database due to the require we do on app.js,
since that module loads the mongoose connection script, by requiring app.js we are almost  
loading the entire task app, we are just missing the part of getting our server to perpetually 
listen for petitions */

beforeEach(populateDataBase) 


/* Our Jest test case, we use supertest (request()) npm module inisde this Jest test
to make HTTP requests to our express app (server), while using supertest (request()),
it's not necessary for the express app (server) to be running (listening to petitions) ,
we just need to provide the very own app object (server object) to supertest
and this npm module is able to perform the specified request (POST on /users) in the example
and make assertions on the app's (server) response, that .expect() method chained to the request
method is actually provided by supertest, it's not the one from Jest*/

test('Should sign up a new user correctly', async () => {
    const response = await request(app).post('/users').send({
        name : "Aldo Supertest",
        email : "testing@example.com",
        password : "roadnet123"
    }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    expect(response.body.user.name).toEqual('Aldo Supertest')
    expect(response.body).toMatchObject({
        user : {
            name : "Aldo Supertest",
            email : "testing@example.com"
        },
        token : user.tokens[0].token
    })
    expect(user.name).toEqual(response.body.user.name)
    expect(response.headers['x-powered-by']).toEqual('Express')
    expect(user.password).not.toEqual("roadnet123")
})

test('Should log in with the existing user credentials', async () => {
    const response = await request(app).post('/users/login').send({
        email : userOne.email,
        password : userOne.password
    }).expect(200)

    //Validating that the second token in the user's token array is the one we just created with log in
    const user = await User.findById(userOne._id.toString())
    expect(user).not.toBeNull()
    expect(user.tokens[1].token).toEqual(response.body.token)
})

test('Should not log in nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email : userOne.email,
        password : 'Fail'
    }).expect(400)
})

test('Should show the user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not fetch the profile for the unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer Fail')
        .send()
        .expect(401)
})

test('Should delete account for authenticated user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    expect(response.body).toMatchObject({
        _id : userOne._id.toString(),
        name : userOne.name,
        email : userOne.email
    })
    const deletedUser = await User.findById(userOne._id)
    expect(deletedUser).toBeNull()
})

test('Should not delete account for unauthenticated user', async ()=> {
    await request(app)
        .delete('/users/me')
        .set('Authorization', 'Bearer Fail')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'jest_tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOne._id.toString())
    expect(user).not.toBeNull()
    //This assertion is to check if user.avatar is a buffer type
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    const update = {
        name : 'Updated!',
        email : 'updated@update.com',
        age : 111
    }
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(update)
        .expect(200)
    const updatedUser = await User.findById(userOne._id.toString())
    expect(updatedUser).not.toBeNull()
    update._id = userOne._id
    expect(updatedUser).toMatchObject(update)
})

test('Should not update invalid user fields', async () => {
    const forbidden = {
        location : 'Invalid',
        attribute : 'Invalid'
    }
    const errorResponse = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(forbidden)
        .expect(400)
    expect(errorResponse.body.error).not.toBeUndefined()
    expect(errorResponse.body.error).toEqual('You are trying to update a non-valid or non-existant property')
    const nonUpdatedUser = await User.findById(userOne._id)
    expect(nonUpdatedUser).not.toBeNull()
    expect(nonUpdatedUser).not.toMatchObject(forbidden)
})
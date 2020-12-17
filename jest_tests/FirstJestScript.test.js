const { 
    calculateTip, 
    fahrenheitToCelsius, 
    celsiusToFahrenheit, 
    add } = require('../src/jest_tested_scripts/math')

test('First Jest test, calculate total amount!', () => {
    const total = calculateTip(10, 0.3)
    //if(total !== 13) throw new Error(`Total should be 13, not ${total}.`) We need to switch to 'expect'
    expect(total).toEqual(13)
})

test('Test the default value calculating the tip', () => {
    const total = calculateTip(10)
    expect(total).toEqual(12.5)
})

test('Should convert 32 F to 0 C', () => {
    const conversion = fahrenheitToCelsius(32)
    expect(conversion).toEqual(0)
})

test('Should convert 0 C to 32 F', () => {
    const conversion = celsiusToFahrenheit(0)
    expect(conversion).toEqual(32)
})

/* To let Jest know we are providing asynchronous code inisde a test,
we pass a parameter to the test function, it is the name of a 
function that needs to be called inside the test so Jest can consider
the test as finished */

/* test('First async test', (done) => {
    setTimeout(() => {
        expect(1).toEqual(2)
        done()
    }, 2000)
}) */

test('Should add two numbers handling the promise', (done) => {
    add(2,3).then((resolveValue) => {
        expect(resolveValue).toEqual(5)
        done()
    })
})

test('Should add two numbers using async/await', async () => {
    const result = await add(5,4)
    expect(result).toEqual(9)
})
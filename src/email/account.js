const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.EMAIL_API_KEY)

const sendWelcomeEmail = (email, name) => {
        return sgMail.send({
            to : email,
            from : 'aldodominguezchz@gmail.com',
            subject : 'Welcome to the test app!',
            text : `Welcome to the app, ${name}. This is a test mail!` 
        })
}

const sendCancellationEmail = (email, name) => {
    return sgMail.send({
        to : email,
        from : 'aldodominguezchz@gmail.com',
        subject : 'We are sad to see you go :(',
        text : `We are sorry to see you leave our test app, ${name}, please let us know if there is something we can improve`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}
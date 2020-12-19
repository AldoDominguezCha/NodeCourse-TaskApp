/* We are providing a mock module that is going to substitute the original use of '@sendgrid/mail', 
here in this mock module we are setting the functions that the original @sendgrid/mail was
providing, only this time the functions are empty, so while testing the app, no emails will be
sent when sgMail.send() is called */
module.exports = {
    setApiKey() {
        
    },
    send(){

    }
}
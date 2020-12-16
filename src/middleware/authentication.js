const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ' , '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id : decoded._id, 'tokens.token' : token }) 
        if(!user) return res.status(401).send({ error : "No user with an active token like the one provided" })
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error : "Invalid authentication" })
    }
}

module.exports = authenticate
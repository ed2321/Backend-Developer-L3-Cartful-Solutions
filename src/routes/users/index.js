const users = require('express').Router()
const { authenticateToken } = require('../../middleware/auth')
const {
    registerUser,
    loginUser,
    logoutUser,
} = require('../../controllers/userController')

users.post('/register', registerUser)
users.post('/login', loginUser)
users.post('/logout', authenticateToken, logoutUser)

module.exports = users

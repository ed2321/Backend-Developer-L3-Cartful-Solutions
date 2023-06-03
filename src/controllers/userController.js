const dynamoDB = require('../database')
const schemaUser = require('../schemas/users/users.schema')
const schemaLogin = require('../schemas/users/login.schema')
const usersRepository = require('../repositories/users')
const authRepository = require('../repositories/auth')
const jwt = require('jsonwebtoken')
const { encryptPassword, comparePassword } = require('../utils')

const registerUser = async (req, res) => {
    const validationResult = schemaUser.validate(req.body)
    if (validationResult.error) {
        return res.status(400).json(validationResult.error.details)
    }

    const { firstName, lastName, email, password } = req.body

    const user = await usersRepository.getUser(email)
    if (user) {
        return res
            .status(400)
            .json({ error: `The user with the email ${email} already exists` })
    }

    const newUser = {
        firstName,
        lastName,
        email,
        password: await encryptPassword(password),
    }

    try {
        await dynamoDB.connect()
        const response = await usersRepository.postUser(newUser)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            error: `The user couldn't be create in the database: ${error.message}`,
        })
    }
}

const loginUser = async (req, res) => {
    const validationResult = schemaLogin.validate(req.body)
    if (validationResult.error) {
        return res.status(400).json(validationResult.error.details)
    }

    const { email, password } = req.body

    try {
        const user = await usersRepository.getUser(email)
        if (user && comparePassword(password, user.password)) {
            const token = jwt.sign(
                { id: user.id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: '1h',
                }
            )

            user.token = token

            return res.status(200).json(user)
        }

        return res.status(400).json({ error: `Invalid Credentials` })
    } catch (err) {
        return res
            .status(500)
            .json({ error: `We have a problem to login the user` })
    }
}

const logoutUser = async (req, res) => {
    const token =
        req.body.token || req.query.token || req.headers['x-access-token']

    if (!token) {
        return res.status(403).send('A token is required for authentication')
    }

    const logout = {
        token,
    }

    try {
        await dynamoDB.connect()
        await authRepository.postLogout(logout)
        return res
            .status(200)
            .json({ status: true, message: 'logout successfully' })
    } catch (error) {
        return res.status(500).json({
            error: `The user couldn't be create in the database: ${error.message}`,
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
}

const usersModel = require('../database/models/users')

const getUser = async (email) => {
    if (!email) {
        throw new Error('Missing email to check in the database')
    }
    const results = await usersModel.scan('email').contains(email).exec()
    return results[0]
}

const postUser = async (request) => {
    if (!request) {
        throw new Error('Missing request object while creating in DB')
    }
    return await usersModel.create(request)
}

module.exports = {
    getUser,
    postUser,
}

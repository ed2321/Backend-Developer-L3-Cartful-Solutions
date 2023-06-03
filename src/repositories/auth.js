const authModel = require('../database/models/auth')

const getLogout = async (token) => {
    if (!token) {
        throw new Error('Missing email to check in the database')
    }
    const results = await authModel.scan('token').contains(token).exec()
    return results[0]
}

const postLogout = async (request) => {
    if (!request) {
        throw new Error('Missing request object while creating in DB')
    }
    return await authModel.create(request)
}

module.exports = {
    postLogout,
    getLogout,
}

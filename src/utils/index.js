const bcrypt = require('bcryptjs')
const saltRounds = 10

const encryptPassword = async (password) => {
    let returnValue
    await bcrypt.hash(password, saltRounds).then((hash) => {
        returnValue = hash
    })

    return returnValue
}

const comparePassword = async (bodyPassword, modelPassword) => {
    let returnValue
    await bcrypt.compare(bodyPassword, modelPassword).then((res) => {
        returnValue = res
    })

    return returnValue
}

module.exports = {
    encryptPassword,
    comparePassword,
}

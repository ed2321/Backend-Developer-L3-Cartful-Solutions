const joi = require('joi')

module.exports = joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
})

const joi = require('joi')

module.exports = joi.object({
    name: joi.string().required(),
    url: joi.string().required(),
    image: joi.string().required(),
    price: joi.string().required(),
    color: joi.string().required(),
    category: joi.string().required(),
    status: joi.string().required(),
})

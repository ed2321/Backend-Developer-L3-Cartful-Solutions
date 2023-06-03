const routes = require('express').Router()
const users = require('./users')
const products = require('./products')

routes.use('/api/users', users)
routes.use('/api/products', products)

module.exports = routes

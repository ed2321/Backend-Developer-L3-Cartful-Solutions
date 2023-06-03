const products = require('express').Router()
const { authenticateToken } = require('../../middleware/auth')
const {
    registerProduct,
    getAllProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    likeProduct,
    dislikeProduct,
    recommendProduct,
    getMostLikedProducts,
    getMostDislikedProducts,
} = require('../../controllers/ProductsController')

//marketing
products.get('/most-liked', authenticateToken, getMostLikedProducts)
products.get('/most-disliked', authenticateToken, getMostDislikedProducts)

//products
products.get('/recommend', authenticateToken, recommendProduct)
products.post('/register', authenticateToken, registerProduct)
products.get('/getAll', authenticateToken, getAllProduct)
products.get('/:sku', authenticateToken, getProduct)
products.put('/:sku', authenticateToken, updateProduct)
products.delete('/:sku', authenticateToken, deleteProduct)
products.post('/like/:sku', authenticateToken, likeProduct)
products.post('/dislike/:sku', authenticateToken, dislikeProduct)

module.exports = products

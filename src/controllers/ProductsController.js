const dynamoDB = require('../database')
const schemaProduct = require('../schemas/products/products.schema')
const productsRepository = require('../repositories/products')

const registerProduct = async (req, res) => {
    const validationResult = schemaProduct.validate(req.body)
    if (validationResult.error) {
        return res.status(400).json(validationResult.error.details)
    }

    const { name, url, image, price, color, category, status } = req.body

    const newProduct = {
        name,
        url,
        image,
        price,
        color,
        category,
        status,
    }

    try {
        await dynamoDB.connect()
        const response = await productsRepository.postProduct(newProduct)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            error: `The product couldn't be created in the database: ${error.message}`,
        })
    }
}

const getProduct = async (req, res) => {
    const { sku } = req.params

    if (!sku) {
        return res.status(400).json({ error: 'SKU is required' })
    }
    try {
        await dynamoDB.connect()
        const response = await productsRepository.getProduct(sku)

        if (!response || response.length === 0) {
            return res.status(404).json({ error: 'Product not found' })
        }
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            error: `The product couldn't be retrieved from the database: ${error.message}`,
        })
    }
}

const getAllProduct = async (req, res) => {
    const { limit, offset } = req.query
    const limitFilter = limit || 10
    const offsetFilter = (offset - 1) * limitFilter
    try {
        await dynamoDB.connect()
        const response = await productsRepository.getAllProduct(
            limitFilter,
            offsetFilter
        )
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            error: `The products couldn't be retrieved from the database: ${error.message}`,
        })
    }
}

const updateProduct = async (req, res) => {
    const validationResult = schemaProduct.validate(req.body)
    if (validationResult.error) {
        return res.status(400).json(validationResult.error.details)
    }
    const { name, url, image, price, color, category, status } = req.body
    const { sku } = req.params
    // Check if the product exists in the database
    const existingProduct = await productsRepository.getProduct(sku)

    if (!existingProduct || existingProduct.length === 0) {
        return res.status(404).json({ error: 'Product not found' })
    }

    const updateData = {
        name,
        url,
        image,
        price,
        color,
        category,
        status,
    }

    try {
        await dynamoDB.connect()
        const updatedProduct = await productsRepository.updateProduct(
            { sku },
            updateData
        )
        return res.status(200).json(updatedProduct)
    } catch (error) {
        return res.status(500).json({
            error: `The product couldn't be updated in the database: ${error.message}`,
        })
    }
}

const deleteProduct = async (req, res) => {
    const { sku } = req.params

    try {
        const existingProduct = await productsRepository.getProduct(sku)

        if (!existingProduct || existingProduct.length === 0) {
            return res.status(404).json({ error: 'Product not found' })
        }

        await productsRepository.deleteProduct(sku)

        return res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
        return res.status(500).json({
            error: `The product couldn't be deleted from the database: ${error.message}`,
        })
    }
}

const likeProduct = async (req, res) => {
    const { sku } = req.params
    const { id } = req.user

    if (!sku) {
        return res.status(400).json({ error: 'SKU is required' })
    }

    try {
        await dynamoDB.connect()

        // Check if the product exists
        const existingProduct = await productsRepository.getProduct(sku)
        if (!existingProduct || existingProduct.length === 0) {
            return res.status(404).json({ error: 'Product not found' })
        }

        // Get the first product from the array
        const product = existingProduct[0]

        // Check if the user has already liked the product
        if (product.likedBy.includes(id)) {
            return res
                .status(400)
                .json({ error: 'User already liked the product' })
        }

        // Update the likedBy field of the product with the user's ID
        product.likedBy.push(id)

        // Remove the user ID from the dislikedBy list if present
        const updatedDislikedBy = product.dislikedBy.filter(
            (userId) => userId !== id
        )

        // Exclude the updatedAt and dislikedBy fields from the update operation
        const updateData = {
            likedBy: product.likedBy,
            dislikedBy: updatedDislikedBy,
        }

        // Save the changes to the database
        const updatedProduct = await productsRepository.updateProduct(
            { sku },
            updateData
        )

        return res.status(200).json(updatedProduct)
    } catch (error) {
        return res
            .status(500)
            .json({ error: `Error liking the product: ${error.message}` })
    }
}

const dislikeProduct = async (req, res) => {
    const { sku } = req.params
    const { id } = req.user

    if (!sku) {
        return res.status(400).json({ error: 'SKU is required' })
    }
    try {
        await dynamoDB.connect()

        // Check if the product exists
        const existingProduct = await productsRepository.getProduct(sku)
        if (!existingProduct || existingProduct.length === 0) {
            return res.status(404).json({ error: 'Product not found' })
        }

        // Get the first product from the array
        const product = existingProduct[0]

        // Check if the user has already disliked the product
        if (product.dislikedBy.includes(id)) {
            return res
                .status(400)
                .json({ error: 'User already disliked the product' })
        }

        // Update the dislikedBy field of the product with the user's ID
        product.dislikedBy.push(id)

        // Remove the user ID from the likedBy list if present
        const updatedLikedBy = product.likedBy.filter((userId) => userId !== id)

        // Exclude the updatedAt and likedBy fields from the update operation
        const updateData = {
            dislikedBy: product.dislikedBy,
            likedBy: updatedLikedBy,
        }

        // Save the changes to the database
        const updatedProduct = await productsRepository.updateProduct(
            { sku },
            updateData
        )

        return res.status(200).json(updatedProduct)
    } catch (error) {
        return res
            .status(500)
            .json({ error: `Error disliking the product: ${error.message}` })
    }
}

const recommendProduct = async (req, res) => {
    const { id } = req.user
    try {
        await dynamoDB.connect()

        // Obtener todos los productos que el usuario ha dado "like" o "dislike"
        const userLikedProducts = await productsRepository.getLikedProducts(id)
        const userDislikedProducts =
            await productsRepository.getDislikedProducts(id)


        if (
            userLikedProducts.length === 0 &&
            userDislikedProducts.length === 0
        ) {
            // Si el usuario no ha dado "like" o "dislike" a ningún producto, generar una recomendación aleatoria
            const randomProduct = await productsRepository.getRandomProduct()
            return res.status(200).json(randomProduct)
        }

        // Filtrar y ordenar los productos basados en las preferencias del usuario
        const filteredProducts =
            await productsRepository.filterProductsByPreferences(
                userDislikedProducts
            )
        const sortedProducts =
            await productsRepository.sortProductsBySimilarity(
                filteredProducts,
                userLikedProducts
            )

        // Seleccionar el producto con la mayor similitud como recomendación principal
        const recommendation = sortedProducts[0]

        return res.status(200).json(recommendation)
    } catch (error) {
        return res
            .status(500)
            .json({ error: `Error recommending a product: ${error.message}` })
    }
}

const getMostLikedProducts = async (req, res) => {
    try {
        const mostLikedProducts =
            await productsRepository.getMostLikedProducts()
        return res.status(200).json(mostLikedProducts)
    } catch (error) {
        return res.status(500).json({
            error: `Error retrieving most liked products: ${error.message}`,
        })
    }
}

const getMostDislikedProducts = async (req, res) => {
    try {
        const mostDislikedProducts =
            await productsRepository.getMostDislikedProducts()
        return res.status(200).json(mostDislikedProducts)
    } catch (error) {
        return res.status(500).json({
            error: `Error retrieving most disliked products: ${error.message}`,
        })
    }
}

module.exports = {
    registerProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    likeProduct,
    dislikeProduct,
    recommendProduct,
    getMostLikedProducts,
    getMostDislikedProducts,
}

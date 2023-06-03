const productsModel = require('../database/models/products')

const getAllProduct = async (itemsPerPage, offset) => {
    return productsModel.scan().limit(itemsPerPage).startAt(offset).exec()
}

const postProduct = async (request) => {
    if (!request) {
        throw new Error('Missing request object while creating in DB')
    }
    return productsModel.create(request)
}

const getProduct = async (sku) => {
    return productsModel.query('sku').eq(sku).exec()
}

const updateProduct = async (key, updateData) => {
    return productsModel.update(key, updateData)
}
const deleteProduct = async (sku) => {
    return productsModel.delete(sku)
}

const getLikedProducts = async (userId) => {
    return productsModel.scan().where('likedBy').contains(userId).exec()
}

const getDislikedProducts = async (userId) => {
    return productsModel.scan().where('dislikedBy').contains(userId).exec()
}

const getMostLikedProducts = async () => {
    try {
        const mostLikedProducts = await productsModel.scan().limit(10).exec()
        const filteredProducts = mostLikedProducts.filter(
            (product) => product.likedBy.length > 0
        )
        filteredProducts.sort((a, b) => b.likedBy.length - a.likedBy.length)
        return filteredProducts
    } catch (error) {
        throw new Error(
            `Error retrieving most liked products: ${error.message}`
        )
    }
}

const getMostDislikedProducts = async () => {
    try {
        const mostDislikedProducts = await productsModel.scan().limit(10).exec()
        const filteredProducts = mostDislikedProducts.filter(
            (product) => product.dislikedBy.length > 0
        )
        filteredProducts.sort(
            (a, b) => b.dislikedBy.length - a.dislikedBy.length
        )
        return filteredProducts
    } catch (error) {
        throw new Error(
            `Error retrieving most disliked products: ${error.message}`
        )
    }
}

const getRandomProduct = async () => {
    return productsModel
        .scan()
        .exec()
        .then((products) => {
            const randomIndex = Math.floor(Math.random() * products.length)
            return products[randomIndex]
        })
}

const filterProductsByPreferences = async (dislikedProducts) => {
    const dislikedProductSkus = dislikedProducts.map((product) => product.sku)

    const allProducts = await getAllProduct()

    const filteredProducts = allProducts.filter((product) => {
        return !dislikedProductSkus.includes(product.sku)
    })

    return filteredProducts
}

const calculateProductSimilarity = (productA, productB) => {
    // Comparar las propiedades de los productos y asignar un peso a cada una de ellas
    const priceWeight = 0.2 // Peso del precio en la similitud
    const colorWeight = 0.3 // Peso del color en la similitud
    const categoryWeight = 0.5 // Peso de la categoría en la similitud

    // Calcular la diferencia en cada propiedad y aplicar el peso correspondiente
    const priceDifference =
        Math.abs(productA.price - productB.price) * priceWeight
    const colorDifference = productA.color !== productB.color ? colorWeight : 0
    const categoryDifference =
        productA.category !== productB.category ? categoryWeight : 0

    // Calcular la similitud combinando las diferencias ponderadas
    const similarity =
        1 - (priceDifference + colorDifference + categoryDifference)

    return similarity
}

const sortProductsBySimilarity = async (products, likedProducts) => {
    const likedProductSkus = likedProducts.map((product) => product.sku)
    return products.sort((productA, productB) => {
        const similarityA = calculateProductSimilarity(productA, likedProducts)
        const similarityB = calculateProductSimilarity(productB, likedProducts)
        if (similarityA > similarityB) {
            return -1
        } else if (similarityA < similarityB) {
            return 1
        } else {
            // Si tienen la misma similitud, dar prioridad a los productos que el usuario ha dado "like" más recientemente
            const indexA = likedProductSkus.indexOf(productA.sku)
            const indexB = likedProductSkus.indexOf(productB.sku)
            return indexA - indexB
        }
    })
}

module.exports = {
    getAllProduct,
    postProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getLikedProducts,
    getDislikedProducts,
    getMostLikedProducts,
    getMostDislikedProducts,
    getRandomProduct,
    filterProductsByPreferences,
    sortProductsBySimilarity,
}

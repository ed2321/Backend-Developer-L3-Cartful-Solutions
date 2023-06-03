const dynamoose = require('dynamoose')
const tableName = process.env.PRODUCTS_TABLE || 'products'
const { v4: uuidv4 } = require('uuid')

const productsSchema = new dynamoose.Schema(
    {
        sku: {
            type: String,
            hashKey: true,
            default: uuidv4,
        },
        name: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        likedBy: {
            type: Array,
            default: [],
            schema: [String], // Arreglo de IDs de usuarios que dieron like al producto
        },
        dislikedBy: {
            type: Array,
            default: [],
            schema: [String], // Arreglo de IDs de usuarios que dieron dislike al producto
        },
    },
    {
        saveUnknown: false,
        timestamps: true,
    }
)

const products = dynamoose.model(tableName, productsSchema)

module.exports = products

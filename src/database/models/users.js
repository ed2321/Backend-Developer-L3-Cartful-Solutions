const dynamoose = require('dynamoose')
const tableName = process.env.USERS_TABLE || 'users'
const { v4: uuidv4 } = require('uuid')

const usersSchema = new dynamoose.Schema(
    {
        id: {
            type: String,
            hashKey: true,
            default: uuidv4,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        saveUnknown: false,
        timestamps: true,
    }
)

const users = dynamoose.model(tableName, usersSchema)

module.exports = users

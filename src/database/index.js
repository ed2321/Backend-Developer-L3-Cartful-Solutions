const dynamoose = require('dynamoose')
let isConnected
const configs =
    process.env.NODE_ENV === 'dev'
        ? {
              accessKeyId: process.env.DYNAMODB_AWS_API_KEY,
              secretAccessKey: process.env.DYNAMODB_AWS_SECRET,
              region: process.env.DYNAMODB_AWS_REGION,
              endpoint: process.env.DYNAMODB_LOCAL_ENDPOINT,
          }
        : {
              region: process.env.DYNAMODB_AWS_REGION,
          }

dynamoose.aws.sdk.config.update(configs)

module.exports.connect = () => {
    return new Promise((resolve, reject) => {
        if (isConnected) {
            return resolve()
        }

        try {
            if (process.env.NODE_ENV !== 'dev') {
                dynamoose.aws.ddb.set()
            } else {
                dynamoose.aws.ddb.local(process.env.DYNAMODB_LOCAL_ENDPOINT)
            }

            isConnected = dynamoose.aws.ddb()
            resolve()
        } catch (error) {
            reject('error connecting to database.')
        }
    })
}

const jwt = require('jsonwebtoken')
const authRepository = require('../repositories/auth')

const authenticateToken = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers['x-access-token']

    if (!token) {
        return res
            .status(403)
            .json({ error: 'Token required to authenticate.' })
    }

    const auth = await authRepository.getLogout(token)
    if (auth) {
        return res.status(400).json({ error: 'The token has expired.' })
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token.' })
    }
}

module.exports = {
    authenticateToken,
}

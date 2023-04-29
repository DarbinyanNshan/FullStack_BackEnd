const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token']

    if (!token) {
        return res.status(403).send('A token is required for authentication')
    }
    try {
        const  decodedUser = jwt.verify(token, process.env.TOKEN_KEY)
        req.user = decodedUser
    } catch (error) {
        return res.status(401).send('Invalid Token')
    }
    return next();
}
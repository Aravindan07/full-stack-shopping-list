const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token');

    // Check for token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' }); // 401 - unauthorized
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.get('JwtSecretKey'));
        console.log(decoded);
        //Add user from payload
        req.user = decoded;
        console.log(req.user);
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token is not valid' });
    }
}

module.exports = auth;

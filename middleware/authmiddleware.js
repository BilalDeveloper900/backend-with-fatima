const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(404).json({ error: 'Access denied. No token provided' })
    }

    try {
        const decoded = jwt.verify(token, 'my_secret');
        req.user = decoded;
        console.log(req.user, "req.user")
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }

}
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //Bearer token 
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretToken, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;

        next();
    });
}

module.exports = authenticateToken
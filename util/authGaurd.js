const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try{
        //you get the user token and add it to the header authorization bearer
        const token = req.headers.authorization.split(" ")[1];
        console.log('from auth',token)
        const decode = jwt.verify(token, process.env.JWT_KEY)
        console.log('here',decode)
        req.userData = decode;
    next();
    } catch (error) {
        return res.status(401).json({
            message: 'Check Auth failed',
        })
    }
    
}
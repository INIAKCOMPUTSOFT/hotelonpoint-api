module.exports = function (req, res, next) {
    if (!req.userData.isAcct) return res.status(403).json({message: 'Access denied'});
    next();
}
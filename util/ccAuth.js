module.exports = function (req, res, next) {
    if (!req.userData.isCC) return res.status(403).json({message: 'Access denied'});
    next();
}
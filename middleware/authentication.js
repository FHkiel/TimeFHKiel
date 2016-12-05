/**
 * Created by Abhishek to add middleware to filter request.
 */
function authenticationMiddleware () {
    return function (req, res, next) {

      if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/')
    }
}

module.exports = authenticationMiddleware


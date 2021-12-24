exports.unauthGuard = (req, res, next) => {
    if (req.isAuthenticated()) return res.redirect('/products')
    next()
}

exports.authGuard = (req, res, next) => {
    return next()
    if (req.isAuthenticated()) return next()
    req.flash('error', 'You must be signed in to see the resources')
    res.redirect('/signin')
}
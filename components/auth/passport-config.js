const LocalStrategy = require('passport-local').Strategy
const adminService = require('../admin/adminService')

module.exports = async (passport) => {
    passport.use(new LocalStrategy(async (username, password, done) => {
        const admin = await adminService.findByUsername(username)

        // Match username
        if (!admin) return done(null, false, {message: 'Can not find admin with that username'})

        // Match password
        try {
            if (await adminService.validatePassword(password, admin)) return done(null, admin)
            else return done(null, false, {message: 'Password incorrect'})
        } catch (err) {
            return done(err)
        }
    }))
    passport.serializeUser((admin, done) => done(null,{id: admin._id, name: `${admin.firstName} ${admin.lastName}`}))
    passport.deserializeUser((admin, done) => done(null,admin))
}
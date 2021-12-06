var express = require('express');
var router = express.Router();
const passport = require('passport');
const auth = require('./guard')

// Render sign in
router.get('/signin', auth.unauthGuard, (req, res) => res.render('signin', {layout: 'emptyLayout'}))

// Sign in
router.post('/signin', auth.unauthGuard, passport.authenticate('local', {
  successRedirect: '/products',
  failureRedirect: '/signin',
  failureFlash: true
}))

// Sign out
router.get('/signout', (req, res) => {
  req.logOut()
  req.flash('info', 'You are signed out')
  res.redirect('/signin')
})

module.exports = router
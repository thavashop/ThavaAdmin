var express = require('express');
var router = express.Router();

// Index
router.get('/', async function(req, res) {
  // res.redirect('products')
  res.redirect('/signin')
});

module.exports = router;

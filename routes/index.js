var express = require('express');
var router = express.Router();
const Product = require('../components/product/productModel')

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.redirect('products')
});

module.exports = router;

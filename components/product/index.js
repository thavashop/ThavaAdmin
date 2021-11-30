var express = require('express');
var router = express.Router();
const controller = require('./productController')

// product list
router.get('/', controller.list);

// add product
router.get('/add', controller.renderAdd);
router.post('/', controller.add)

// edit product
router.get('/edit/:id', controller.renderEdit)
router.post('/edit/:id', controller.edit)

// delete product
router.get('/delete/:id', controller.delete)

module.exports = router;

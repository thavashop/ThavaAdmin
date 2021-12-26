var express = require('express');
var router = express.Router();
const controller = require('./productController')

// product list
router.get('/', controller.list);

// best sellers list
router.get('/top', controller.top);

// add product
router.get('/add', controller.renderAdd);
router.post('/', controller.add)

// edit product
router.get('/:id/edit', controller.renderEdit)
router.put('/:id', controller.edit)

// delete product
router.delete('/:id', controller.delete)

module.exports = router;

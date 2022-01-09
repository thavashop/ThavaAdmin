var express = require('express');

var router = express.Router();
const controller = require('./productController')

// product list
router.get('/', controller.list);

// best sellers list
router.get('/top', controller.top);

// add product
router.route('/add')
    .get(controller.renderAdd)
    .post(controller.add)

// image file handle
router.route('/image')
    .post(controller.saveImage)
    .delete(controller.deleteImage)

// edit product
router.get('/:id/edit', controller.renderEdit)
router.put('/:id', controller.edit)

// delete product
router.delete('/:id', controller.delete)

module.exports = router;

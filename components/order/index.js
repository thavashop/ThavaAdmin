var express = require('express');
var router = express.Router();
const controller = require('./orderController')

// order list
router.get('/', controller.list);

// order details
router.get('/:id', controller.details)

// add order
router.get('/add', controller.renderAdd);
router.post('/', controller.add)

// edit order
// router.get('/:id/edit', controller.renderEdit)
router.get('/:id/edit', controller.edit)

// delete order
router.delete('/:id', controller.delete)

module.exports = router;

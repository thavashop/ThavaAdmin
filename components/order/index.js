var express = require('express');
var router = express.Router();
const controller = require('./orderController')

// order list
router.get('/', controller.list);

// sales by time periods
router.get('/analysis', controller.analysis)

// add order
router.get('/add', controller.renderAdd);
router.post('/', controller.add)

// order details
router.get('/:id', controller.details)

// edit order
router.get('/:id/edit', controller.edit)

// delete order
// router.delete('/:id', controller.delete)

module.exports = router;

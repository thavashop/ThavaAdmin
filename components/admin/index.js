const express = require('express');
const router = express.Router();
const controller = require('./adminController.js')

// view profile
router.get('/profile', controller.view)

// account list
router.get('/', controller.list);

// add account
router.get('/add', controller.renderAdd);
router.post('/', controller.add)

// edit profile
// router.get('/:id/edit', controller.renderEdit)
router.put('/', controller.edit)

// delete account
// router.delete('/:id', controller.delete)

module.exports = router;

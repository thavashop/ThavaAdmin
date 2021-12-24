const express = require('express');
const router = express.Router();
const controller = require('./userController.js')

// view profile
// router.get('/profile', controller.view)

// account list
router.get('/', controller.list);

// account details
router.get('/:id', controller.details)

// ban/unban account
router.get('/:id/ban', controller.ban)
router.get('/:id/unban', controller.unban)

// add account
// router.get('/add', controller.renderAdd);
// router.post('/', controller.add)

// edit profile
// router.get('/:id/edit', controller.renderEdit)
// router.put('/', controller.edit)

// delete account
// router.delete('/:id', controller.delete)

module.exports = router;

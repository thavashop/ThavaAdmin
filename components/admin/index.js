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

// ban/unban account
router.post('/ban', controller.ban)
router.post('/unban', controller.unban)

// edit profile
router.put('/', controller.edit)

// delete account
// router.delete('/:id', controller.delete)

module.exports = router;

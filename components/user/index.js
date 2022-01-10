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
router.post('/ban', controller.ban)
router.post('/unban', controller.unban)

// delete account
// router.delete('/:id', controller.delete)

module.exports = router;

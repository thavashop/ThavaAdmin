var express = require('express');
const multer = require('multer')

var router = express.Router();
const controller = require('./productController')

// setup multer
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, './uploads'),
        filename: (req, file, cb) => cb(null, file.originalname),
    })
})

// product list
router.get('/', controller.list);

// best sellers list
router.get('/top', controller.top);

// add product
router.get('/add', controller.renderAdd);
router.post('/add', upload.array('image', 5), controller.add)

// edit product
router.get('/:id/edit', controller.renderEdit)
router.put('/:id', controller.edit)

// delete product
router.delete('/:id', controller.delete)

module.exports = router;

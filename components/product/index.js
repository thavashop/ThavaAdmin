var express = require('express');
var router = express.Router();
const controller = require('./productController')
const Product = require('./productModel')
const imageMineTypes = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg']

/* GET home page. */
router.get('/', controller.list);

/* GET add product page. */
router.get('/add', async (req, res) => {
    renderAddPage(res, new Product())
});

router.post('/', async function (req, res) {
    const body = req.body
    const product = new Product({
        name: body.name,
        price: body.price,
        description: body.description,
    })
    saveImage(product, body.image)    
    // console.log(product);

    try {
        const newProduct = await product.save()
        renderAddPage(res, new Product(), 1)
    } catch {
        renderAddPage(res, product, -1)
    }
})

async function renderAddPage(res, product, flag = 0) {
    try {
        const params = {
            product: product
        }
        if (flag == -1) params.errMessage = 'Error creating product'
        else if (flag == 1) params.success = 'Product created'
        res.render('./products/add', params)
    } catch {
        res.redirect('products')
    }
}

function saveImage(product, imageEncoded) {
    if (imageEncoded == null || imageEncoded == '') return
    const image = JSON.parse(imageEncoded)
    if (image != null && imageMineTypes.includes(image.type)) {
        product.image = new Buffer.from(image.data, 'base64')
        product.imageType = image.type
    }
}

module.exports = router;

const baseModule = require('hbs');
const Product = require('./productModel')
const imageMineTypes = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg']

exports.list = async function (req, res) {
    try {
        const products = await Product.find({})
        res.render('index', { products: products });
    } catch {
        console.log('err getting products');
        res.render('index')
    }
}

exports.renderAdd = async (req, res) => {
    renderAddPage(res, new Product())
}

exports.add = async function (req, res) {
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
}

exports.renderEdit = async function (req, res) {
    try {
        const product = await Product.findById(req.params.id)
        renderEditPage(res, product)
    } catch {
        console.log('something wrong');
    }
}

exports.edit = async function(req, res) {
    try {
        const id = req.params.id
        const body = req.body
        const dummy = new Product()
        saveImage(dummy, body.image)
        const product = await Product.updateOne({_id: id}, {$set: {
            name: body.name,
            price: body.price,
            description: body.description,
            image: dummy.image,
            imageType: dummy.imageType
        }})
        console.log(product);
        renderEditPage(res, product, 1)
    } catch {
        console.log('something wrong');
    }
}

exports.delete = async function(req, res) {
    try {
        const result = await Product.deleteOne({_id: req.params.id})
        console.log(result);
        res.redirect('/products')
        // some feed back?        
    } catch {
        console.log('something wrong');
        res.redirect('/products')
    }
}

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

async function renderEditPage(res, product, flag = 0) {
    try {
        const params = {
            product: product
        }
        if (flag == -1) params.errMessage = 'Error editting product'
        else if (flag == 1) params.success = 'Product editted'
        res.render('products/edit', params)
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
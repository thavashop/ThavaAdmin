const Product = require('./productModel')
const imageMineTypes = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg']

exports.list = async function (req, res) {
    try {
        const products = await Product.find({})
        let success
        let error
        console.log(req.query);
        if (req.query.del == 1) success = 'Product deleted'
        if (req.query.del == 0) error = "There's a problem deleting product"
        if (req.query.edt == 1) success = 'Product editted'
        res.render('index', { products: products, success: success, error: error });
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
    } catch (err) {
        console.log(err);
        res.redirect('products')
    }
}

exports.edit = async function (req, res) {
    const id = req.params.id
    let product
    try {
        const body = req.body
        // const dummy = new Product()
        // saveImage(dummy, body.image)
        // const result = await Product.updateOne({_id: id}, {$set: {
        //     name: body.name,
        //     price: body.price,
        //     description: body.description,
        //     image: dummy.image,
        //     imageType: dummy.imageType
        // }})
        // console.log(result);
        product = await Product.findById(id)
        with (product) {
            name = body.name
            price = body.price
            description = body.description
        }
        saveImage(product, body.image)
        await product.save()
        // renderEditPage(res, product, 1)
        res.redirect('/products?edt=1')
    } catch (err) {
        console.log(err);
        renderEditPage(res, product, -1)
    }
}

exports.delete = async function (req, res) {
    try {
        const result = await Product.deleteOne({ _id: req.params.id })
        console.log(result);
        // res.render('/products', { success: 'Product deleted' })
        res.redirect('/products?del=1')
    } catch (err) {
        console.log(err);
        // res.render('/products', { error: "There's a problem deleting product" })
        res.redirect('/products?del=0')
    }
}

async function renderAddPage(res, product, flag = 0) {
    try {
        const params = {
            product: product
        }
        if (flag == -1) params.error = 'Error creating product'
        else if (flag == 1) params.success = 'Product created'
        res.render('./products/add', params)
    } catch (err) {
        console.log(err);
        res.redirect('products')
    }
}

async function renderEditPage(res, product, flag = 0) {
    try {
        const params = {
            product: product
        }
        if (flag == -1) params.error = 'Error editting product'
        else if (flag == 1) params.success = 'Product editted'
        res.render('products/edit', params)
    } catch (err) {
        console.log(err);
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
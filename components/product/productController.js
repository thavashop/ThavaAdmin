const formidable = require('formidable')
const productService = require('./productService')
const cloudinary = require('../cloudinary')
const fs = require('fs')

exports.list = async function (req, res) {
    try {
        // pagination        
        const itemPerPage = 5
        const nProduct = await productService.count()
        const nPage = Math.ceil(nProduct / itemPerPage)
        const pages = Array.from(Array(nPage), (_, i) => i + 1)
        const q = req.query
        let page = q.page == null ? 0 : q.page - 1
        const products = await productService.findByPage(page, itemPerPage)

        res.render('product/views/index', {
            page: page + 1,
            pages: pages,
            products: products,
        });
    } catch (err) {
        console.log(err);
        res.render('product/views/index')
    }
}

exports.renderAdd = async (req, res) => {
    renderAddPage(res, productService.create())
}

exports.saveImage = async (req, res) => {
    const form = formidable({ multiples: false })
    try {
        const files = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(files);
            });
        });
        const { filepath, mimetype, newFilename: id, originalFilename: filename } = files.image
        res.writeHead(200, { 'Content-Type': mimetype });
        res.end(filepath);

    } catch (error) {
        console.log(error);
    }
}

exports.deleteImage = async (req, res) => {
    const {path} = req.body
    try {
        fs.unlinkSync(path)        
        return res.status(200).send()
    } catch (error) {
        return res.status(403).send()
    }
}

exports.add = async (req, res) => {
    const product = productService.create(req.body)
    if (product.image != '') product.image = await Promise.all(
        product.image.map(async path => await uploadToCloudinary(product._id, path)))
    try {
        await product.save()
        req.flash('success', 'Product added')
        renderAddPage(res, productService.create())
    } catch (error) {
        console.log(error);
        req.flash('error', 'Product add failed')
        renderAddPage(res, product)
    }
}

exports.renderEdit = async (req, res) => {
    try {
        const product = await productService.findById(req.params.id)
        renderEditPage(res, req.query.page, product)
    } catch (err) {
        console.log(err);
        res.redirect('products')
    }
}

exports.edit = async function (req, res) {
    let product
    try {
        // handle images
        const productId = req.params.id
        let images = req.body.image
        if (!Array.isArray(images)) images = Array(images)
        if (images != '') req.body.image = await Promise.all(
            images.map(async path => {
                await cloudinary.api.delete_resources_by_tag(productId)
                return await uploadToCloudinary(productId, path)
        }))
        else req.body.image = null

        product = await productService.edit(req.params.id, req.body)
        req.flash('success', 'Product editted')
        res.redirect('/products?&page=' + req.query.page)
    } catch (err) {
        console.log(err);
        req.flash('error', 'Product edit failed')
        renderEditPage(res, req.query.page, product)
    }
}

exports.delete = async function (req, res) {
    try {
        const result = await productService.deleteOne(req.params.id)
        console.log(result);
        req.flash('success', 'Product deleted')
    } catch (err) {
        console.log(err);
        req.flash('error', 'Product delete failed')
    }
    res.redirect('/products?page=' + req.query.page)
}

exports.top = async (req, res) => {
    try {
        const products = await productService.top(10)
        res.render('product/views/top', { products })
    } catch (err) {
        console.log(err);
    }
}

async function renderAddPage(res, product) {
    res.render('./product/views/add', {
        product: product,
        everySize: productService.everySize
    })
}

async function renderEditPage(res, page, product) {
    res.render('product/views/edit', {
        product: product,
        page: page,
        everySize: productService.everySize
    })
}

// function saveImage(product, imageEncoded) {
//     const imageMineTypes = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg']
//     if (imageEncoded == null || imageEncoded == '') return
//     const image = JSON.parse(imageEncoded)
//     if (image != null && imageMineTypes.includes(image.type)) {
//         product.image = new Buffer.from(image.data, 'base64')
//         product.imageType = image.type
//     }
// }

async function uploadToCloudinary(productId, filePath) {
    const imageId = filePath.slice(filePath.lastIndexOf('\\') + 2)
    const pathOnCloudinary = `products/${productId}/${imageId}`
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            public_id: pathOnCloudinary,
            tags: productId,
            transformation: {
                width: 250,
                height: 337,
                crop: 'fit',
            },
        })
        fs.unlinkSync(filePath)
        return result.url
    } catch (error) {
        console.log(error);
        fs.unlinkSync(filePath)
        return 'fail'
    }
}
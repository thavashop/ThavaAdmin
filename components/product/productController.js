const productService = require('./productService')
const Product = productService.model
const imageMineTypes = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg']

exports.list = async function (req, res) {
    try {
        // pagination        
        const itemPerPage = 5
        const nProduct = await productService.count()
        const nPage = Math.ceil(nProduct / itemPerPage)
        const pages = Array.from(Array(nPage), (_, i) => i + 1)
        const q = req.query
        let page = q.page == null ? 0 : q.page - 1
        page = Math.max(0, Math.min(page, nPage-1))
        // let clampedPage = Math.max(0, Math.min(page, nPage-1))
        // if (page != clampedPage) {
        //     clampedPage = clampedPage + 1
        //     res.redirect('/products?page='+clampedPage)    
        // }
        const products = await productService.findByPage(page, itemPerPage)

        res.render('products/index', {
            page: page + 1,
            pages: pages,
            products: products,
        });
    } catch (err) {
        console.log(err);
        res.render('products/index')
    }
}

exports.renderAdd = async (req, res) => {    
    renderAddPage(res, new Product())
}

exports.add = async (req, res) => {
    const body = req.body
    const product = new Product({
        name: body.name,
        price: body.price,
        description: body.description,
        brand: body.brand,
        material: body.material,
        care: body.care,
        color: body.color,
        size: body.size
    })
    saveImage(product, body.image)

    try {
        await product.save()
        req.flash('success','Product added')
        renderAddPage(res, new Product())
    } catch {
        req.flash('error','Product add failed')
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
        const body = req.body
        product = await productService.findById(req.params.id)
        with (product) {
            name = body.name
            price = body.price
            description = body.description
            brand = body.brand
            material = body.material
            care = body.care
            color = body.color
            size = body.size
        }
        saveImage(product, body.image)
        await product.save()
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

async function renderAddPage(res, product) {  
    res.render('./products/add', {
        product: product,
        everySize: Product.everySize
    })
}

async function renderEditPage(res, page, product) {
    res.render('products/edit', {
        product: product,
        page: page,
        everySize: Product.everySize
    })
}

function saveImage(product, imageEncoded) {
    if (imageEncoded == null || imageEncoded == '') return
    const image = JSON.parse(imageEncoded)
    if (image != null && imageMineTypes.includes(image.type)) {
        product.image = new Buffer.from(image.data, 'base64')
        product.imageType = image.type
    }
}
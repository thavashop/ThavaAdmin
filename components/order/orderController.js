const orderService = require('./orderService')

exports.list = async (req, res) => {
    try {
        const orders = await orderService.list()
        res.render('order/views/index', { orders });
    } catch (err) {
        console.log(err);
        res.render('order/views/index')
    }
}

exports.details = async (req, res) => {
    try {
        const order = await orderService.findById(req.params.id).populate('customer').lean()
        const products = await orderService.getProductEntries(order.details)
        res.render('order/views/details', {
            order: order,
            customer: order.customer,
            products: products
        });
    } catch (err) {
        console.log(err);
        res.render('order/views/details')
    }
}

exports.renderAdd = async (req, res) => {    
    renderAddPage(res, orderService.new())
}

exports.add = async (req, res) => {
    const body = req.body

    // test
    const User = require('../user/userModel')

    let user
    try {
        user = await User.findById(body.custormer).lean()
    } catch (err) {
        console.log(err);
    }

    const a = body.products.split(',')
    let products = []
    a.forEach(x => {
        const item = x.split(' ')
        products.push({
            id: item[0],
            amount: item[1]
        })
    });

    const order = new orderService.model({
        customer: user._id,
        details: products,
        status: body.status,
        paymentType: body.paymentType
    })

    try {
        await order.save()
        req.flash('success','Order added')
        renderAddPage(res, orderService.new())
    } catch (err) {
        console.log(err);
        req.flash('error','Order add failed')
        renderAddPage(res, order)
    }
}

exports.renderEdit = async (req, res) => {
    try {
        const product = await orderService.findById(req.params.id)
        renderEditPage(res, req.query.page, product)
    } catch (err) {
        console.log(err);
        res.redirect('products')
    }
}

exports.edit = async (req, res) => {
    try {
        let status = req.query.status
        if (status == 'notDelivered') status = 'Not delivered'
        else if (status == 'delivering') status = 'Delivering'
        else if (status == 'delivered') status = 'Delivered'
        await orderService.updateStatus(req.params.id, status)

        req.flash('success', 'Order status updated')
        res.redirect('/orders')
    } catch (err) {
        console.log(err);
    }
}

exports.delete = async function (req, res) {
    try {
        const result = await orderService.deleteOne(req.params.id)
        console.log(result);
        req.flash('success', 'Product deleted')
    } catch (err) {
        console.log(err);
        req.flash('error', 'Product delete failed')
    }
    res.redirect('/products?page=' + req.query.page)
}

async function renderAddPage(res, order) {  
    res.render('order/views/add', {order})
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
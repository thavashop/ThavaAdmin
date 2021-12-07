const adminService = require('./adminService')
const Admin = adminService.model
const imageMineTypes = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg']

const flash = require('express-flash')

exports.list = async (req, res) => {
    try {
        // pagination        
        const itemPerPage = 10
        const nAdmin = await adminService.count()
        const nPage = Math.ceil(nAdmin / itemPerPage)
        const pages = Array.from(Array(nPage), (_, i) => i + 1)
        const q = req.query
        let page = q.page == null ? 0 : q.page - 1
        page = Math.max(0, Math.min(page, nPage-1))
        // let clampedPage = Math.max(0, Math.min(page, nPage-1))
        // if (page != clampedPage) {
        //     clampedPage = clampedPage + 1
        //     res.redirect('/products?page='+clampedPage)    
        // }
        const admins = await adminService.findByPage(page, itemPerPage)

        // notification
        res.render('accounts/index', {
            page: page + 1,
            pages: pages,
            accounts: admins,
        });
    } catch (err) {
        console.log(err);
        res.render('accounts/index')
    }
}

exports.renderAdd = async (req, res) => {
    renderAddPage(res, adminService.new())
}

exports.add = async (req, res) => {
    const body = req.body

    // validate password
    if (body.password != body.password2) {
        req.flash('error','Password confirmation does not match')
        return renderAddPage(res, body)
    }

    const admin = new Admin({
        username: body.username,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone
    })
    // saveImage(admin, body.image)

    try {
        adminService.add(admin)
        req.flash('success','Admin account added')
        renderAddPage(res, adminService.new())
    } catch (err) {
        console.log(err);
        renderAddPage(res, admin)
    }
}

// exports.renderEdit = async function (req, res) {
//     try {
//         const product = await productService.findById(req.params.id)
//         renderEditPage(res, req.query.page, product)
//     } catch (err) {
//         console.log(err);
//         res.redirect('products')
//     }
// }

exports.edit = async function (req, res) {
    try {
        const body = req.body
        await adminService.edit(req.user.id, body)
        req.flash('success','Profile editted')
        res.redirect('/accounts/profile')
    } catch (err) {
        console.log(err);
        req.flash('error','Profile edit failed')
        res.redirect('/accounts/profile')
    }
}

// exports.delete = async function (req, res) {
//     try {
//         const result = await productService.deleteOne(req.params.id)
//         console.log(result);
//         // res.render('/products', { success: 'Product deleted' })
//         res.redirect('/products?del=1&page=' + req.query.page)
//     } catch (err) {
//         console.log(err);
//         // res.render('/products', { error: "There's a problem deleting product" })
//         res.redirect('/products?del=0&page=' + req.query.page)
//     }
// }

exports.view = async (req, res) => {
    const admin = await adminService.findById(req.user.id)
    res.render('accounts/profile', {account: admin})
}

async function renderAddPage(res, admin) {
    res.render('accounts/add', {account: admin})
}

async function renderEditPage(res, page, product, flag = 0) {
    try {
        const params = {
            product: product,
            page: page,
            everySize: Admin.everySize
        }
        if (flag == -1) params.error = 'Error editting product'
        else if (flag == 1) params.success = 'Product editted'
        res.render('products/edit', params)
    } catch (err) {
        console.log(err);
        res.redirect('/products')
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
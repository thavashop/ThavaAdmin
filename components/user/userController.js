const userService = require('./userService')

exports.list = async (req, res) => {
    try {
        // pagination        
        // const itemPerPage = 10
        // const nAdmin = await userService.count()
        // const nPage = Math.ceil(nAdmin / itemPerPage)
        // const pages = Array.from(Array(nPage), (_, i) => i + 1)
        // const q = req.query
        // let page = q.page == null ? 0 : q.page - 1
        // page = Math.max(0, Math.min(page, nPage-1))
        // const users = await userService.findByPage(page, itemPerPage)
        const users = await userService.findAll()

        // notification
        res.render('user/views/index', {
            // page: page + 1,
            // pages: pages,
            accounts: users,
        });
    } catch (err) {
        console.log(err);
        res.render('user/views/index')
    }
}

exports.details = async (req, res) => {
    try {
        const user = await userService.findById(req.params.id)
        res.render('user/views/profile', {user})
    } catch (error) {
        console.log(error);
    }
}

exports.ban = async (req, res) => {
    try {
        await userService.ban(req.params.id)
        const username = await userService.getUsername(req.params.id)

        req.flash('success', `User ${username} banned`)
        res.redirect('/users')
    } catch (error) {
        console.log(error);
    }
}

exports.unban = async (req, res) => {
    try {
        await userService.unban(req.params.id)
        const username = await userService.getUsername(req.params.id)

        req.flash('success', `User ${username} unbanned`)
        res.redirect('/users')
    } catch (error) {
        console.log(error);
    }
}

// exports.renderAdd = async (req, res) => {
//     renderAddPage(res, userService.new())
// }

// exports.add = async (req, res) => {
//     const body = req.body

//     // validate password
//     if (body.password != body.password2) {
//         req.flash('error','Password confirmation does not match')
//         return renderAddPage(res, body)
//     }

//     const user = new Admin({
//         username: body.username,
//         password: body.password,
//         firstName: body.firstName,
//         lastName: body.lastName,
//         email: body.email,
//         phone: body.phone
//     })

//     try {
//         await userService.add(user)
//         req.flash('success','Admin account added')
//         renderAddPage(res, userService.new())
//     } catch (err) {
//         console.log(err);
//         req.flash('error','Admin account add failed')
//         renderAddPage(res, user)
//     }
// }

// exports.renderEdit = async function (req, res) {
//     try {
//         const product = await productService.findById(req.params.id)
//         renderEditPage(res, req.query.page, product)
//     } catch (err) {
//         console.log(err);
//         res.redirect('products')
//     }
// }

// exports.edit = async function (req, res) {
//     try {
//         await userService.edit(req.user.id, req.body)
//         req.flash('success','Profile editted')
//         res.redirect('/users/profile')
//     } catch (err) {
//         console.log(err);
//         req.flash('error','Profile edit failed')
//         res.redirect('/users/profile')
//     }
// }

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

// exports.view = async (req, res) => {
//     const user = await userService.findById(req.user.id)
//     res.render('user/views/profile', {account: user})
// }

// async function renderAddPage(res, user) {
//     res.render('user/views/add', {account: user})
// }
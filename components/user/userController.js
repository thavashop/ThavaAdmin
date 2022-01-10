const userService = require('./userService')

exports.list = async (req, res) => {
    try {
        // pagination        
        let itemPerPage = req.query.itemPerPage
        if (itemPerPage == undefined) itemPerPage = 10
        else itemPerPage = Number(itemPerPage)
        const nAdmin = await userService.count()
        const nPage = Math.ceil(nAdmin / itemPerPage)
        const pages = Array.from(Array(nPage), (_, i) => i + 1)
        const q = req.query
        let page = q.page == null ? 0 : q.page - 1
        const users = await userService.findByPage(page, itemPerPage)

        // notification
        res.render('user/views/index', {
            page: page + 1,
            pages,
            itemPerPage,
            accounts: users,
            options: [5, 10, 15, 20]
        });
    } catch (err) {
        console.log(err);
        res.render('user/views/index')
    }
}

exports.details = async (req, res) => {
    try {
        const user = await userService.findById(req.params.id)
        res.render('user/views/profile', { user })
    } catch (error) {
        console.log(error);
    }
}

exports.ban = async (req, res) => {
    const { target } = req.body
    try {
        await userService.ban(target)
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        const name = await userService.getAdminname(target)
        res.status(403).send('Error banning admin ' + name)
    }
}

exports.unban = async (req, res) => {
    try {
        await userService.unban(req.body.target)
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.sendStatus(403)
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

// exports.view = async (req, res) => {
//     const user = await userService.findById(req.user.id)
//     res.render('user/views/profile', {account: user})
// }
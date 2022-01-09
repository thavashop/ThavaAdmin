const adminService = require('./adminService')
const Admin = adminService.model

exports.list = async (req, res) => {
    try {
        // pagination        
        const itemPerPage = 10
        const nAdmin = await adminService.count()
        const nPage = Math.ceil(nAdmin / itemPerPage)
        const pages = Array.from(Array(nPage), (_, i) => i + 1)
        const q = req.query
        let page = q.page == null ? 0 : q.page - 1
        const admins = await adminService.findByPage(page, itemPerPage)

        // notification
        res.render('admin/views/index', {
            page: page + 1,
            pages: pages,
            accounts: admins,
        });
    } catch (err) {
        console.log(err);
        res.render('admin/views/index')
    }
}

exports.renderAdd = async (req, res) => {
    renderAddPage(res, adminService.create())
}

exports.add = async (req, res) => {
    const body = req.body

    // validate password
    if (body.password != body.password2) {
        req.flash('error','Password confirmation does not match')
        return renderAddPage(res, body)
    }

    const admin = adminService.create(body)
    try {
        if (await adminService.existedUsername(admin.username)) {
            req.flash('error','That username is already used')
            renderAddPage(res, admin)
        }
        else {
            await adminService.add(admin)
            req.flash('success','Admin account added')
            renderAddPage(res, adminService.create())
        }
    } catch (err) {
        console.log(err);
        req.flash('error','Admin account add failed')
        renderAddPage(res, admin)
    }
}

exports.edit = async function (req, res) {
    try {
        await adminService.edit(req.user.id, req.body)
        req.flash('success','Profile editted')
        res.redirect('/admins/profile')
    } catch (err) {
        console.log(err);
        req.flash('error','Profile edit failed')
        res.redirect('/admins/profile')
    }
}

exports.view = async (req, res) => {
    const admin = await adminService.findById(req.user.id)
    res.render('admin/views/profile', {account: admin})
}

exports.ban = async (req, res) => {
    const {target} = req.body
    try {
        if (target == req.user.id) {
            res.status(403).send('You can not ban yourself, silly')
        }
        else {
            await adminService.ban(req.body.target)
            res.sendStatus(200)
        }
    } catch (error) {
        console.log(error);
        const name = await adminService.getAdminname(target)
        res.status(403).send('Error banning admin ' + name)
    }
}

exports.unban = async (req, res) => {
    try {
        await adminService.unban(req.body.target)
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.sendStatus(403)
    }
}

async function renderAddPage(res, admin) {
    res.render('admin/views/add', {account: admin})
}
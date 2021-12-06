const Admin = require('./adminModel')
const bcrypt = require('bcrypt')

exports.validatePassword = (password, admin) => bcrypt.compare(password, admin.password)

exports.findByUsername = (username) =>  Admin.findOne({username: username}).lean()

exports.count = () => Admin.count({}).exec()

exports.findByPage = (page, itemPerPage) => Admin.find({}).skip(page * itemPerPage).limit(itemPerPage)

exports.findById = (id) => Admin.findById(id)

exports.new = () => new Admin()

exports.add = async (admin) => {
    try {
        // hash password
        const hashedPassword = await bcrypt.hash(admin.password, 10)
        admin.password = hashedPassword
        await admin.save()
    } catch (err) {
        console.log(err);
    }
}

exports.model = Admin
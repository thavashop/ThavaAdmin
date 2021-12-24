const Admin = require('./userModel')
const bcrypt = require('bcrypt')

exports.validatePassword = (password, admin) => bcrypt.compare(password, admin.password)

exports.findByUsername = (username) =>  Admin.findOne({username: username}).lean()

exports.count = () => Admin.count({}).exec()

exports.findByPage = (page, itemPerPage) => Admin.find({}).skip(page * itemPerPage).limit(itemPerPage).lean()

exports.findById = (id) => Admin.findById(id).lean()

exports.new = () => new Admin()

exports.add = async (admin) => {
    const originalPassword = admin.password
    try {
        // hash password
        const hashedPassword = await bcrypt.hash(admin.password, 10)
        admin.password = hashedPassword
        await admin.save()
    } catch (err) {
        admin.password = originalPassword
        throw err
    }
}

exports.edit = async (id, changes) => {
    try {
        const admin = await Admin.findById(id)
        with (admin) {
            firstName = changes.firstName
            lastName = changes.lastName
            email = changes.email
            phone = changes.phone
        }
        await admin.save()
    } catch (err) {
        console.log(err);
    }
}

exports.model = Admin
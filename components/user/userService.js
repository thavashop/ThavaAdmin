const User = require('./userModel')
const bcrypt = require('bcrypt')

exports.validatePassword = (password, admin) => bcrypt.compare(password, admin.password)

exports.findByUsername = (username) =>  User.findOne({username: username}).lean()

exports.count = () => User.count({}).exec()

exports.findByPage = (page, itemPerPage) => User.find({}).skip(page * itemPerPage).limit(itemPerPage).lean()

exports.findById = (id) => User.findById(id).lean()

exports.findAll = () => User.find()

exports.new = () => new User()

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
        const admin = await User.findById(id)
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

exports.ban = async (id) => {
    try {
        await User.updateOne({_id: id}, {$set: {status: 'banned'}})
    } catch (err) {
        console.log(err);
    }
}

exports.unban = async (id) => {
    try {
        await User.updateOne({_id: id}, {$set: {status: 'activated'}})
    } catch (err) {
        console.log(err);
    }
}

exports.getUsername = async (id) => {
    const user = await User.findById(id).lean()
    return user.username
}

exports.model = User
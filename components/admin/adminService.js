const Admin = require('./adminModel')
const bcrypt = require('bcrypt')

exports.validatePassword = (password, admin) => bcrypt.compare(password, admin.password)

exports.findByUsername = (username) =>  Admin.findOne({username: username}).lean()

exports.findById = (id) => Admin.findById(id)
const Product = require('./productModel')

exports.list = () => Product.find({}).lean()

exports.count = () => Product.count({}).exec()

exports.findByPage = (page, itemPerPage) => Product.find({}).skip(page * itemPerPage).limit(itemPerPage).lean({virtuals: true})

exports.findById = (id) => Product.findById(id).lean({virtuals: true})

exports.deleteOne = (id) => Product.deleteOne({ _id: id })

exports.top = (n) => Product.find({}).sort({'sales':'desc'}).limit(n).lean({virtuals: true})

exports.model = Product
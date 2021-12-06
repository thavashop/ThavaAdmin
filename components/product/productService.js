const Product = require('./productModel')

exports.list = () => Product.find({}).lean()

exports.count = () => Product.count({}).exec()

exports.findByPage = (page, itemPerPage) => Product.find({}).skip(page * itemPerPage).limit(itemPerPage)

exports.findById = (id) => Product.findById(id)

exports.deleteOne = (id) => Product.deleteOne({ _id: id })

exports.model = Product
const Product = require('./productModel')

exports.list = () => Product.find({}).lean()

exports.count = (filter) => Product.count(filter).exec()

exports.findByPage = (page, itemPerPage, filter) => Product.find(filter, {'image': {$slice: 1}}).skip(page * itemPerPage).limit(itemPerPage)

exports.findById = (id) => Product.findById(id)

exports.deleteOne = (id) => Product.deleteOne({ _id: id })

exports.top = (n) => Product.find({}).sort({'sales':'desc'}).limit(n)

exports.edit = (id, changes) => Product.updateOne({_id: id}, changes)

exports.create = (data) => new Product(data)

exports.getAllValueOf = (field) => Product.distinct(field)

exports.everySize = () => Product.everySize
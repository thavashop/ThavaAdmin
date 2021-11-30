const Product = require('./productModel')


exports.list = async function (req, res) {
    try {
        const products = await Product.find({})
        res.render('index', { products: products });
    } catch {
        console.log('err getting products');
        res.render('index')
    }
}
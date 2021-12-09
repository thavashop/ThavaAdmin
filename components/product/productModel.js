const mongoose = require('mongoose')
const mongooseLeanVirtuals = require('mongoose-lean-virtuals')

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: Buffer,
    image2: String,
    material: String,
    care: String,
    brand: String,
    color: String,
    size: Array,
    imageType: String,
    description: String
})

schema.virtual('imageObj').get(function() {
    if (this.image != null && this.imageType != null) {
        return `data:${this.imageType};charset=utf-8;base64,${this.image.toString('base64')}`
    }
})

schema.plugin(mongooseLeanVirtuals)

module.exports = mongoose.model('Product', schema, 'product')
module.exports.everySize = ['S','M','L','XL','XXL']
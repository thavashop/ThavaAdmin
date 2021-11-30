const mongoose = require('mongoose')

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
    imageType: String,
    description: String
})

schema.virtual('imageObj').get(function() {
    if (this.image != null && this.imageType != null) {
        return `data:${this.imageType};charset=utf-8;base64,${this.image.toString('base64')}`
    }
})

module.exports = mongoose.model('Product', schema, 'test')
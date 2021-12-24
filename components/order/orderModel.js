const mongoose = require('mongoose')

const schema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    details: {
        type: Array
    },
    status: String,
    paymentType: String
})

module.exports = mongoose.model('Order', schema, 'order')
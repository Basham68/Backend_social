const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    content: String,
    images: {
        type: String,
        required: true
    },
  
    user: {type: mongoose.Types.ObjectId, ref: 'user'}
}, {
    timestamps: true
})

module.exports = mongoose.model('post', postSchema)
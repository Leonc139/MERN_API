const mongoose = require('mongoose');
//schema merupakan sebuah istilah untuk menentukan sebuah model
const Schema = mongoose.Schema;

//membuat schema(model baru) untuk blog post
const BlogPost = new Schema({
    title: {
        type: String,
        // kewajiban
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    image: {
        // yang disimpan di mongoDB hanya path atau url
        type: String,
        required: true,
    },
    author: {
        type: Object,
        required: true,
    }
}, {
    timestamps: true
});

// ('nama model(bebas)', format model)
module.exports = mongoose.model('BlogPost', BlogPost);
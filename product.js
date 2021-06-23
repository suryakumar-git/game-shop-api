var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* var product = new Schema ({
    title: String,
    price: Number,
    likes: {type: Number, default: 0}
}); */

var product = new Schema ({
    price: Number,
    title: String,
    imgUrl: String
});

module.exports = mongoose.model('Product',product);
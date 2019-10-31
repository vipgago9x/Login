let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Shop');
let productSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    price: Number,
    image: String,
    sex: String,
});

let cartSchema = new mongoose.Schema({
    clientID: String,
    product: Object,
});

let orderSchema = new mongoose.Schema({
    fullname: String,
    phone_number: String,
    address: String,
    note: String,
    is_completed: Boolean,
    time_order: Date,
    cart: Array,
});

let userSchema = new mongoose.Schema({
    usr: String,
    pwd: String,
    email: String,
    name: String,
});

let products = mongoose.model('products', productSchema);
let cart = mongoose.model('cart', cartSchema);
let order = mongoose.model('order', orderSchema);
let user = mongoose.model('user', userSchema);


module.exports.cart = cart;
module.exports.products = products;
module.exports.order = order;
module.exports.user = user;
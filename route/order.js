let express = require('express');
let app = express();
let model = require('../models/model');
let Order = model.order;
let Cart = model.cart;
let Product = model.products;
let cookieParser = require('cookie-parser');

app.use(cookieParser());

app.route('/order')
    .get((req, res) => {
        return res.render('order', { req: req });
    })
    .post((req, res) => {
        var id = req.cookies.id;
        Cart.find({ clientID: id }, (err, items) => {
            var data = {
                fullname: req.body.fullname,
                phone_number: req.body.phonenumber,
                address: req.body.address,
                note: req.body.note,
                is_completed: false,
                time_order: Date.now(),
                cart: [...items],
            }
            Order.create(data);
            console.log('da luu don hang');
        });
        Cart.deleteMany({ clientID: id }, (err) => {
            if (err) throw err;
            console.log('da xoa thanh cong');
        });
        return 0;
    });

module.exports = app;
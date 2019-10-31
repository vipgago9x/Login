let express = require('express');
let app = express();
let model = require('../models/model');
let Cart = model.cart;
let cookieParser = require('cookie-parser');
let Product = model.products;
// let io = require('socket.io')(app);

app.use(cookieParser());

app.route('/addcart/:id')
    .get((req, res) => {
        let id = req.params.id;
        let clientID = req.cookies.id;
        console.log(clientID);
        Product.find({ _id: id }, (err, data) => {
            if (err) throw err;
            Cart.create({ product: data, clientID: clientID });
            console.log(data);
        })
        return res.redirect('/single/' + id);
    });

app.get('/cart', (req, res) => {
    let clientID = req.cookies.id;
    Cart.find((err, data) => {
        if (err) throw err;
        var data = data.filter((value, index, data) => {
            if (value.clientID == clientID) return value;
        });
        if (data.length > 0) {
            var total_price = 0;
            data.forEach((item) => {
                total_price += item.product[0].price;
            });
        }
        return res.render('checkout', { req: req, items: data, total_price: total_price });
    });
});




module.exports = app;
var express = require('express');
var app = express();
let models = require('../models/model');
let user = models.user;
let localStrategy = require('passport-local').Strategy;
let Passport = require('passport');
let session = require('express-session');
let indexRouter = require('./index');
let productsRouter = require('./product');
let fbStrategy = require('passport-facebook').Strategy;
let singleRouter = require('./single');
let cartRouter = require('./cart');
let orderRouter = require('./order');
let addRouter = require('./add');
let nodeMailer = require('nodemailer');
/* GET users listing. */

app.use(session({ secret: 'mysecret', cookie: { maxAge: 1000 * 60 * 60 } }));
app.use(Passport.initialize());
app.use(Passport.session());
app.use('/products', productsRouter);
app.use('/', indexRouter);
app.use('/', singleRouter);
app.use('/', cartRouter);
app.use('/', orderRouter);
app.use('/', addRouter);

app.route('/register')
    .get((req, res) => { return res.render('register', { req: req }) })
    .post((req, res) => {
        let username = req.body.username;
        let password1 = req.body.password1;
        let password2 = req.body.password2;
        let email = req.body.email;
        let name = req.body.name;
        if (password1 != password2) {
            return res.redirect('/register');
        }
        let data = {
            usr: username,
            pwd: password1,
            email: email,
            name: name,
        }
        user.find((err, items) => {
            let userRecord = items.find(user => user.usr == data.usr);
            console.log(userRecord);
            if (userRecord) {
                return res.redirect('/register');
            } else {
                user.create(data);
                return res.redirect('/');
            }
        });
    });


app.route('/login')
    .get((req, res) => { return res.render('login', { req: req }) })
    .post(Passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' }));

Passport.use(new localStrategy(
    (username, password, done) => {
        console.log('hello');
        user.find((err, items) => {
            if (err) throw err;
            let userRecord = items.find(user => user.usr == username);
            if (userRecord && userRecord.pwd == password) {
                return done(null, userRecord);
            } else {
                return done(null, false);
            }
        });
    }
));

app.get('/login/fb', Passport.authenticate('facebook', { scope: ['email', 'username'] }));

app.get('/login/fb/cb', Passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/' }));

Passport.use(new fbStrategy({
        clientID: '405807656955692',
        clientSecret: '986f4efce3d825bac471bfd226b52120',
        callbackURL: 'http://localhost:8000/login/fb/cb',
        profileFields: ['email', 'username'],
    },
    (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        return done(null, profile.id);
    }
));

Passport.serializeUser((user, done) => {
    done(null, user);
});
Passport.deserializeUser((username, done) => {
    console.log('success');
    done(null, username);
});

app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = app;
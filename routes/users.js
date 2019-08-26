var express = require('express');
var app = express();
let model = require('../models/model');
let User = model.user;
let UserGG = model.usergg;
let UserFB = model.userfb;
let Passport = require('passport');
let localStrategy = require('passport-local').Strategy;
let fbStrategy = require('passport-facebook').Strategy;
let hashPassword = require('password-hash');
let ggStrategy = require('passport-google-oauth').OAuth2Strategy;
/* GET users listing. */


app.route('/register')
    .get((req, res) => {
        return res.render('register', { wrong: '' });
    })
    .post((req, res) => {
        console.log('...');
        if (req.body.password1 != req.body.password2 || req.body.password1.length < 6) {
            console.log(1);
            return res.render('register', { wrong: 'Wrong password.' });
        }
        let checkEmail = new RegExp('[^A-Za-z0-9@.]', 'i');
        if (checkEmail.test(req.body.email) == true || /@/.test(req.body.email) == false) {
            console.log(2);
            return res.render('register', { wrong: 'Invalid email' });;
        }
        User.findOne({ email: req.body.email }, (err, data) => {
            if (err) throw err;
            if (data) {
                console.log(3);
                return res.render('register', { wrong: 'Email exists' });;
            } else {
                let pwd = hashPassword.generate(req.body.password2);

                let newUser = {
                    email: req.body.email,
                    pwd: pwd,
                    name: req.body.name,
                }
                User.create(newUser);
                return res.redirect('/');

            }
        });
    });


app.route('/login')
    .get((req, res) => { return res.render('login', { message: '' }) })
    .post(Passport.authenticate('local', { failureRedirect: '/users/login', successRedirect: '/', failureFlash: true, successFlash: true }));

Passport.use(new localStrategy(
    (username, password, done) => {
        User.findOne({ email: username }, (err, data) => {
            if (err) return done(err);
            if (data) {
                if (hashPassword.verify(password, data.pwd) == true) {
                    console.log('1');
                    return done(null, data);
                } else {
                    console.log('wrong password');
                    return done(null, false, { message: 'invalid password' });
                }
            } else {
                return done(null, false, { message: 'no such email.' });
            }
        });
    }
));

app.get('/login/fb', Passport.authenticate('facebook', { scope: ['email'] }));
app.get('/login/fb/cb', Passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/users/login' }));

Passport.use(new fbStrategy({
        clientID: '515037005929890',
        clientSecret: 'fc2dbd605b84fbdd385164e491792ac2',
        callbackURL: 'http://localhost:8000/users/login/fb/cb',
        profileFields: ['email', 'name'],
    },
    (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        UserFB.findOne({ email: profile._json.email }, (err, data) => {
            if (err) throw err;
            if (data) {

                return done(null, data);
            } else {
                let newUser = {
                    email: profile._json.email,
                    name: profile._json.first_name + ' ' + profile._json.last_name,
                    passport: '',
                };
                UserFB.create(newUser);
                return done(null, newUser);
            }
        });
    }
));

app.get('/login/gg', Passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/login/gg/cb', Passport.authenticate('google', { failureRedirect: '/users/login', successRedirect: '/', failureFlash: true }));

Passport.use(new ggStrategy({
        clientID: '534994218728-4lpaurs78tc4eucdgoba5p5aoi1chbap.apps.googleusercontent.com',
        clientSecret: 'tGHaf8nhABAXEEEK_mtRfJWa',
        callbackURL: 'http://localhost:8000/users/login/gg/cb',

    },
    (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        UserGG.findOne({ email: profile._json.email }, (err, data) => {
            if (err) throw err;
            if (data) {
                return done(null, data);
            } else {
                let newUser = {
                    email: profile._json.email,
                    name: profile._json.name,
                    passport: '',
                };
                UserGG.create(newUser);
                return done(null, newUser);
            }
        });
    }
));

Passport.serializeUser((user, done) => {
    console.log('serialize');
    return done(null, user);
});

Passport.deserializeUser((user, done) => {
    console.log('deserialize');
    return done(null, user);
});



module.exports = app;
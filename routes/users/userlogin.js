var express = require('express')
var LoginRouter = express.Router();
const {body, check, validationResult}= require('express-validator');
var passport = require('passport');
var csurf = require('csurf');

var csurfProtection = csurf(); 
LoginRouter.use(csurfProtection);

LoginRouter.get('/login', isLoggedIn, (req, res)=>{
    var messages = req.flash('error');
    res.render('user/login', {csurfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0})
});

LoginRouter.post('/login', [
    body('email', 'invalid email').isEmail().notEmpty(),
    body('password').notEmpty()], passport.authenticate('local.login', {
    successRedirect: '/user/profile',
    failureRedirect:'/user/login',
    failureFlash: true
}));

module.exports = LoginRouter;


function isLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
      return next()
    }
    res.redirect('/');
}
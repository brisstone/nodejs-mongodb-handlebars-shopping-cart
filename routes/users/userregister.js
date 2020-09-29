var express = require('express')
var RegisterRouter = express.Router();
var csurf = require('csurf');
var validator = require('../../config/validator')
var passport = require('passport');
const {body, check, validationResult}= require('express-validator');



var csurfProtection = csurf(); 
RegisterRouter.use(csurfProtection);

RegisterRouter.get('/register', (req, res)=>{
    var messages = req.flash('error');
    res.render('user/register', {csurfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0})
});

RegisterRouter.post('/register',[
    body('email', 'invalid email').isEmail().notEmpty(),
    body('password').isLength({min : 5}).withMessage('must be at least 5 chars long')
    .matches(/\d/).withMessage('must contain a number')], passport.authenticate('local.register', {
    successRedirect: '/user/profile',
    failureRedirect:'/user/register',
    failureFlash: true
}));
 

module.exports = RegisterRouter;


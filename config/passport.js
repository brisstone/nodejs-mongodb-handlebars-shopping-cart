var passport = require('passport');
var User = require('../model/user');
var LocalStrategy = require('passport-local').Strategy;
const {body, check, validationResult}= require('express-validator');

passport.serializeUser(function(user,done){
    // serialize user by id when storing user in the session
    done(null, user.id)
})


passport.deserializeUser(function(id,done){
    // serialize user by id when storing user in the session
    User.findById(id, function (err, user){
        done(err, user)
   
    })
})

// signup Strategy to use when creating a new user, it taken in two argument; a js object and a callback
passport.use('local.register', new LocalStrategy({
    usernameField: 'email',
    password: 'password',
    passReqToCallback : true
}, function(req, email, password, done){
    

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        var messages = [];
        
        for(i = 0; i< errors.errors.length; i++){
            console.log(errors.errors[i].msg)
             messages.push(errors.errors[i].msg)
        }
           
        return done(null, false, req.flash('error', messages));
    }

    // find if the user that wants to register already exits in the database
    User.findOne({'email': email}, (err, user)=>{
        if(err){
          
            return done(err)
            
        }
        if(user){
            return done(null, false, {message: 'user is already in use'})
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if(err){
               
                return done(err)
            }
            return done(null, newUser);
        })
    })
}))


// passport to take care of signin
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    password: 'password',
    passReqToCallback : true
}, function(req, email, password, done){
    

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        var messages = [];
        
        for(i = 0; i< errors.errors.length; i++){
            console.log(errors.errors[i].msg)
             messages.push(errors.errors[i].msg)
        }
           
        return done(null, false, req.flash('error', messages));
    }

    // find if the user that wants to register already exits in the database
    User.findOne({'email': email}, (err, user)=>{
        if(err){
          
            return done(err)
            
        }
        if(!user){
            return done(null, false, {message: 'no user found'})
        }
        if(!user.validPassword(password)){
            return done(null, false, {message : 'wrong password'})
        }
        return done(null, user)
    })
}))
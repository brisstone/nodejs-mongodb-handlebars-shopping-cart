var express = require('express')
var ProfileRouter = express.Router();



ProfileRouter.get('/profile', isLoggedIn, (req, res)=>{
    res.render('user/profile')
})


module.exports = ProfileRouter;

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/');
}
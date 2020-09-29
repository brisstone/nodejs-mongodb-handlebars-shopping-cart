var express = require('express')
var LogoutRouter = express.Router();



LogoutRouter.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
})


module.exports = LogoutRouter;

//if you are not loggedin you can accesss the routes
function isLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next()
    }
    res.redirect('/');
}


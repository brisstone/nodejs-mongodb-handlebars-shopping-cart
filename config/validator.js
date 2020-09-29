const {body, check, validationResult}= require('express-validator');

module.exports = function validator(req, res, next){
    check('email').isEmail;
    check('password').isLength({min : 5}).withMessage('must be at least 5 chars long')
    .matches(/\d/).withMessage('must contain a number')

   
            const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors)
            res.status(400).json({errors: errors.array()});
        
        }
        next()  
    
    
}


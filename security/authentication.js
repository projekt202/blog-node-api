'use strict';
let claimService = new (require('../services/claimService'))();

function authenticate(req, res, next) {

    /*Don't authenticate for create user and the authentication service*/
    if(req.url === '/authenticate'
        || (req.url === '/users' && req.method === 'POST' )){
        return next();
    }

    var apiKey = req.header('api-key');
    if(!apiKey){
        res.send(401)
    }

    /*Lookup key and validate it*/
    claimService.validateToken(apiKey)
        .then((isValid)=>{
            if(!isValid){
                res.send(401);
            }
            return next();
        });
}


module.exports = authenticate;
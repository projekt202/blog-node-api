'use strict';
let claimService = new (require('../services/claimService'))();
let userService = new (require('../services/userService'))();

function authenticate(req, res, next) {

    /*Don't authenticate for create user and the authentication service*/
    if(req.url === '/authenticate'
        || (req.url === '/users' && req.method === 'POST' )){
        return next();
    }

    /*If there isn't an api-key header then they aren't authenticated*/
    var apiKey = req.header('api-key');
    if(!apiKey){
        res.send(401)
    }

    /*Validate the token*/
    claimService.validateToken(apiKey)
        .then((result)=>{

            /*If it's not valid then they aren't authenticated.*/
            if(!result.isValid){
                res.send(401);
                return next(false);
            }

            /*Get the user and attach it to the request*/
            userService.getById(result.userId)
                .then((user)=>{
                    if(!user){
                        /*No user so they aren't authenticated (shouldn't ever happen)*/
                        res.send(401);
                        return next(false);
                    }
                    req.user = user;
                    return next();
                })
                .catch((e)=>{
                    /* Some error happened, TODO: log it */
                    res.send(401);
                });
        });
}


module.exports = authenticate;
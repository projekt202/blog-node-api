'use strict';
let claimService = new (require('../services/claimService'))();
let userService = new (require('../services/userService'))();

function authenticate(server) {
    var server = server;

    function unauthorized(){
        res.send(401)
        return next(false);
    }

    function authenticateRequest(req, res, next) {

        /*Don't authenticate for create user and the authentication service*/
        if(req.url === '/authenticate'
            || (req.url === '/users' && req.method === 'POST' )){
            return next();
        }

        /*If there isn't an api-key header then they aren't authenticated*/
        var apiKey = req.header('Authorization');
        if(!apiKey){
            res.header('WWW-Authenticate','Bearer api-key'); /*RFC7235, Section 3.1*/
            return unauthorized();
        }
        apiKey = apiKey.replace('Bearer', '').trim();

        /*Validate the token*/
        claimService.validateToken(apiKey)
            .then((result)=>{

                /*If it's not valid then they aren't authenticated.*/
                if(!result.isValid){
                    return unauthorized();
                }

                /*Get the user and attach it to the request*/
                userService.getById(result.userId)
                    .then((user)=>{
                        if(!user){
                            /*No user so they aren't authenticated (shouldn't ever happen)*/
                            return unauthorized();
                        }
                        req.user = user;
                        return next();
                    })
                    .catch((e)=>{
                        /* Some error happened */
                        console.log('Unable to get a user', e)
                        return unauthorized();
                    });
            })
            .catch((e)=>{
                /*Manually emit the uncaught exception event because we are in a promise.*/
                server.emit('uncaughtException', req, res, req.route, e);
                next(false);
            });
    }

    return (authenticateRequest);
}

module.exports = authenticate;


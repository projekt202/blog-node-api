'use strict';
let claimService = new (require('../services/claimService'))();
let userService = new (require('../services/userService'))();
let controllerErrors = require('../controllers/controllerErrors');
let serviceErrors = require('../services/serviceErrors');

function authenticate(server) {

    function unauthorized(res, next){
        res.send(401);
        return next(false);
    }

    function authenticateRequest(req, res, next) {

        // Don't authenticate for create user and the authentication service 
        if(req.url === '/authenticate'
            || (req.url === '/users' && req.method === 'POST' )){
            return next();
        }

        // If there isn't an api-key header then they aren't authenticated 
        var apiKey = req.header('Authorization');
        if(!apiKey){
            res.header('WWW-Authenticate', 'Bearer api-key'); // RFC7235, Section 3.1
            return unauthorized(res, next);
        }
        apiKey = apiKey.replace('Bearer', '').trim();

        claimService.validateToken(apiKey)
            .then((storedToken)=> {
                return userService.getById(storedToken.userId);
            })
            .then((user)=> {
                if (!user) {
                    throw new controllerErrors.UnauthorizedError();
                }
                req.user = user;
                return next();
            })
            .catch(serviceErrors.InvalidClaim, () => {
                return next(new controllerErrors.UnauthorizedError());
            })
            .catch(controllerErrors.UnauthorizedError, (e) => {
                return next(e);
            })
            .catch((e)=> {
                // Manually emit the uncaught exception event because we are in a promise.
                server.emit('uncaughtException', req, res, req.route, e);
                next(false);
            });
    }

    return (authenticateRequest);
}

module.exports = authenticate;


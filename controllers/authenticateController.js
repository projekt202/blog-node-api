'use strict';

let userService = new (require('../services/userService'))();
let claimService = new (require('../services/claimService'))();
let serviceErrors = require('../services/serviceErrors');
let controllerErrors = require('./controllerErrors');

class AuthenticateController {
    check(req, res, next) {
        // Ensure the required fields were sent
        if(!req.body.emailAddress || !req.body.password){
            res.send(new controllerErrors.BadRequestError('emailAddress and password are required'));
            return;
        }

        // Get the user's info for the supplied email
        userService.validatePassword(req.body.emailAddress, req.body.password)
            .then((user)=> {
                //Create the claim
                return claimService.create(req, user);
            })
            .then((clientToken)=> {
                //Return the token to the caller
                res.send({token: clientToken});
                return next();
            })
            .catch(serviceErrors.InvalidUserPassword, () => {
                return next(new controllerErrors.UnauthorizedError());
            })
            .catch(serviceErrors.ValidationError, (e) => {
                return next(new controllerErrors.BadRequestError(e));
            })
            .catch((e)=> {
                req.server.emit('uncaughtException', req, res, req.route, e);
                next(false);
            });

    }
}
module.exports = AuthenticateController;
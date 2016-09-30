'use strict';

let userService = new (require('../services/userService'))();
let claimService = new (require('../services/claimService'))();
let serviceErrors = require('../services/serviceErrors');
let controllerErrors = require('./controllerErrors');
let passwordHash = require('password-hash');


class AuthenticateController {

    check(req, res, next) {
        /* Ensure the required fields were sent */
        if(!req.body.emailAddress || !req.body.password){
            res.send(new controllerErrors.BadRequestError("emailAddress and password are required"));
            return;
        }

        /* Get the user's info for the supplied username and password */
        userService.getPasswordForEmail(req.body.emailAddress, req.body.password)
            .then((user) => {

                /* If the user's password doesn't match the hashed password stored return unauthorized */
                if(!passwordHash.verify(req.body.password, user.password)){
                    return next(new controllerErrors.UnauthorizedError());
                }

                /* Create and return the claim */
                claimService.create(req, user)
                    .then(function (clientToken) {
                        /* Return the client's token to the caller */
                        res.send({token: clientToken});
                        return next();
                    })
                    .catch(serviceErrors.ValidationError, (e) => {
                        return next(new controllerErrors.BadRequestError(e));
                    })
                    .catch(next);

            })
            .catch((e)=> {
                req.server.emit('uncaughtException', req, res, req.route, e);
                next(false);
            });

    }
}
module.exports = AuthenticateController;
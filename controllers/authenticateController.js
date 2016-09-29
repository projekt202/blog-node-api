'use strict';
let restify = require('restify');
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

                /* Create the authorization token */
                let authToken = claimService.generateClaim(req, user);

                /* Store the signing key for the client token so we can validate it later. */
                claimService.create({userId:user.id, token:authToken.clientToken, signingKey: authToken.signingKey, expiresAt: authToken.expirationDate})
                    .then(function(){
                        /* Return the client's token to the caller */
                        res.send({token:authToken.clientToken});
                        return next();
                    })
                    .catch(serviceErrors.ValidationError, (e) => {
                        return next(new controllerErrors.BadRequestError(e));
                    })
                    .catch((e) => {
                        return next(new controllerErrors.InternalServerError(e));
                    });

            })
            .catch((e) => {
                return next(new controllerErrors.InternalServerError(e));
            });

    }
}
module.exports = AuthenticateController;
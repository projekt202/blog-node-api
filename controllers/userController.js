'use strict';

let userService = new (require('../services/userService'))();
let serviceErrors = require('../services/serviceErrors');
let controllerErrors = require('./controllerErrors');

class UserController {
    get(req, res, next) {

        /*Verify a userId was passed in*/
        if (!req.params.userId) {
            throw new controllerErrors.BadRequestError('The user id is required');
        }

        /*Get the user*/
        userService.getById(req.params.userId)
            .then((user) => {
                if(!user)
                    return next(new controllerErrors.ResourceNotFoundError());

                res.send(user);
                return next();
            })
            .catch(next);
    }

    update(req, res, next) {
        if (!req.params.userId) {
            return next(new controllerErrors.BadRequestError('The user id is required.'));
        }

        if (!req.body) {
            return next(new controllerErrors.BadRequestError('Missing user information.'));
        }

        userService.update(req.params.userId, req.body)
            .then((user) => {
                if(!user)
                    return next(new controllerErrors.ResourceNotFoundError());

                res.send(user);
                return next();
            })
            .catch(serviceErrors.ValidationError, (e) => {
                return next(new controllerErrors.ValidationError(e));
            })
            .catch(next);
    }

    create(req, res, next) {
        userService.create(req.body)
            .then((user) => {
                res.send(user);
                return next();
            })
            .catch(serviceErrors.ValidationError, (e) => {
                return next(new controllerErrors.ValidationError(e));
            })
            .catch(next);
    }
}

module.exports = UserController;

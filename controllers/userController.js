'use strict';
let restify = require('restify');
let userService = new (require('../services/userService'))();
let errorModule = require('../errors');
let serviceErrors = require('../services/serviceErrors');
let controllerErrors = require('./controllerErrors');


class UserController {
    get(req, res, next) {
        if (!req.params.id) {
            throw new errorModule.BadRequestError('The user id is required');
        }

        userService.getById(req.params.id)
            .then((user) => {
                if(!user)
                    return next(new controllerErrors.ResourceNotFoundError());

                res.send(user);
                return next();
            })
            .catch((e) => {
                return next(new controllerErrors.InternalServerError(e));
            });
    }

    update(req, res, next) {
        if (!req.params.id) {
            return next(new restify.BadRequestError('The user id is required.'));
        }

        if (!req.body) {
            return next(new restify.BadRequestError('Missing user information.'));
        }

        userService.update(req.params.id, req.body)
            .then((user) => {
                if(!user)
                    return next(new controllerErrors.ResourceNotFoundError());

                res.send(user);
                return next();
            })
            .catch(serviceErrors.ValidationError, (e) => {
                    return next(new controllerErrors.BadRequestError(e));
            })
            .catch((e) => {
                return next(new controllerErrors.InternalServerError(e));
            });
    }

    create(req, res, next) {
        userService.create(req.body)
            .then((user) => {
                res.send(user);
                return next();
            })
            .catch(serviceErrors.ValidationError, (e) => {
                return next(new controllerErrors.BadRequestError(e));
            })
            .catch((e) => {
                return next(new controllerErrors.InternalServerError(e));
            });
    }
}

module.exports = UserController;

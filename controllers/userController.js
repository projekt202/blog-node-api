'use strict';
let restify = require('restify');
let userService = new (require('../services/userService'))();
let errorModule = require('../errors');

class UserController {
    get(req, res, next) {
        if (!req.params.id) {
            throw new errorModule.BadRequestError('The user id is required');
        }

        userService.getById(req.params.id)
            .then((user) => {
                res.send(user);
                return next();
            })
            .catch(errorModule.BadRequestError, (e) => {
                return next(new restify.BadRequestError(e.message, e));
            })
            .catch(errorModule.ResourceNotFoundError, (e) => {
                return next(new restify.ResourceNotFoundError(e.message, e));
            })
            .catch((e) => {
                return next(new restify.InternalServerError(e.message, e));
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
                res.send(user);
                return next();
            })
            .catch(errorModule.ResourceNotFoundError, (e) => {
                return next(new restify.ResourceNotFoundError(e.message, e));
            })
            .catch((e) => {
                return next(new restify.InternalServerError(e.message, e));
            });
    }

    create(req, res, next) {
        userService.create(req.body)
            .then((user) => {
                res.send(user);
                return next();
            })
            .catch(errorModule.BadRequestError, (e) => {
                return next(new restify.BadRequestError(e.message, e));
            })
            .catch((e) => {
                return next(new restify.InternalServerError(e.message, e));
            });
    }
}

module.exports = UserController;

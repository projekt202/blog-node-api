/**
 * Created by reggie.samuel on 8/1/2016.
 */

'use strict';
let restify = require('restify');
let UserService = require('../services/userService');
let userService = new UserService();
let errorModule = require('../errors');

class UserController {
    getUserById(req, res, next) {
        if (!req.params.id) {
            throw new errorModule.BadRequestError('The user id is required');
        }

        userService.getUserById(req.params.id).then((user) => {
            res.send(user);
            return next();
        }).catch(errorModule.BadRequestError, (e) => {
            return next(new restify.BadRequestError(e.message, e));
        }).catch(errorModule.ResourceNotFoundError, (e) => {
            return next(new restify.ResourceNotFoundError(e.message, e));
        }).catch((e) => {
            return next(new restify.InternalServerError(e.message, e));
        });
    }

    updateUser(req, res, next) {
        if (!req.params.id) {
            return next(new restify.BadRequestError('The user id is required.'));
        }

        if (!req.body) {
            return next(new restify.BadRequestError('Missing user information.'));
        }

        userService.updateUser(req.params.id, req.body).then((user) => {
            res.send(user);
            return next();
        }).catch(errorModule.ResourceNotFoundError, (e) => {
            return next(new restify.ResourceNotFoundError(e.message, e));
        }).catch((e) => {
            return next(new restify.InternalServerError(e.message, e));
        });
    }

    createUser(req, res, next) {
        userService.createUser(req.body).then((user) => {
            res.send(user);
            return next();
        }).catch(errorModule.BadRequestError, (e) => {
            return next(new restify.BadRequestError(e.message, e));
        }).catch((e) => {
            return next(new restify.InternalServerError(e.message, e));
        });
    }
}

module.exports = UserController;
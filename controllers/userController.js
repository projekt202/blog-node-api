/**
 * Created by reggie.samuel on 8/1/2016.
 */

'use strict';

let restify = require('restify');
let userServiceModule = require('../services/userService');
let userService = new userServiceModule();
let errorModule = require('../errors');

class UserController {
    getUserById(req, res, next) {
        userService.getUserById(req.params.id).then((user) => {
            res.send(user);
            return next();
        }).catch(errorModule.BadRequestError, (e) => {
            return next(new restify.BadRequestError(e.message, e));
        }).catch((e) => {
            return next(new restify.InternalServerError('', e));
        });
    }

    updateUser(req, res, next) {
        userService.updateUser(req.user).then((user) => {
            res.send(user);
            return next();
        }).catch(function (e) {
            return next(new restify.InternalServerError('', e));
        });
    }

    createUser(req, res, next) {
        userService.createUser(req.user).then((user) => {
            res.send(user);
            return next();
        }).catch(errorModule.BadRequestError, (e) => {
            return next(new restify.BadRequestError(e.message, e));
        }).catch(function (e) {
            return next(new restify.InternalServerError('', e));
        });
    }
}

module.exports = UserController;
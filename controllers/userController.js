'use strict';

let userService = new (require('../services/userService'))();
let serviceErrors = require('../services/serviceErrors');
let controllerErrors = require('./controllerErrors');

class UserController {
    get(req, res, next) {

        /* Verify a userId was passed in otherwise return a 400 */
        if (!req.params.userId) {
            throw new controllerErrors.BadRequestError('The user id is required');
        }

        /* Get the user */
        userService.getById(req.params.userId)
            .then((user) => {
                /* If there is no user, return a 404 */
                if(!user) {
                    return next(new controllerErrors.ResourceNotFoundError());
                }
                /* Return the user */
                res.send(user);
                return next();
            })
            .catch((e)=> {
                req.server.emit('uncaughtException', req, res, req.route, e);
                next(false);
            });
    }

    update(req, res, next) {

        /* Ensure there a userId was passed in */
        if (!req.params.userId) {
            return next(new controllerErrors.BadRequestError('The user id is required.'));
        }

        /* Ensure there is data that was passed */
        if (!req.body) {
            return next(new controllerErrors.BadRequestError('Missing user information.'));
        }

        /* Update the user */
        userService.update(req.params.userId, req.body)
            .then((user) => {
                /* If there is no user, return a 404 */
                if(!user) {
                    return next(new controllerErrors.ResourceNotFoundError());
                }
                /* Return the updated user */
                res.send(user);
                return next();
            })
            .catch(serviceErrors.ValidationError, (e) => {
                return next(new controllerErrors.ValidationError(e));
            })
            .catch((e)=> {
                req.server.emit('uncaughtException', req, res, req.route, e);
                next(false);
            });
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
            .catch((e)=> {
                req.server.emit('uncaughtException', req, res, req.route, e);
                next(false);
            });
    }
}

module.exports = UserController;

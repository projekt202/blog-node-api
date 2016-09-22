'use strict';

let restify = require('restify');

class UnauthorizedError extends restify.UnauthorizedError{
    constructor(){
        super();

        this.body.code = this.statusCode;
        this.body.message = 'Unauthorized';

        Error.captureStackTrace(this, UnauthorizedError);
    }
}

class BadRequestError extends restify.BadRequestError{
    constructor(serviceValidationError){
        super({message: serviceValidationError.message});

        this.body.code = this.statusCode;
        this.body.details = serviceValidationError.details;

        Error.captureStackTrace(this, BadRequestError);
    }
}

class ResourceNotFoundError extends restify.ResourceNotFoundError{
    constructor(){
        super({message: 'Resource not found'});
        this.body.code = this.statusCode;
        Error.captureStackTrace(this, ResourceNotFoundError);
    }
}

class InternalServerError extends restify.InternalServerError{
    constructor(serverError){
        super({message: serverError.message});
        this.body.code = this.statusCode;
        Error.captureStackTrace(this, InternalServerError);
    }
}

module.exports.BadRequestError = BadRequestError;

module.exports.ResourceNotFoundError = ResourceNotFoundError;

module.exports.InternalServerError = InternalServerError;

module.exports.UnauthorizedError = UnauthorizedError;

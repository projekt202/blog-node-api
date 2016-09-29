'use strict';

let restify = require('restify');

class ValidationError extends restify.BadRequestError{
    constructor(serviceValidationError){
        super({message: serviceValidationError.message});

        this.body.code = 'InvalidInput';
        this.body.details = serviceValidationError.details;

        Error.captureStackTrace(this, ValidationError);
    }
}

class BadRequestError extends restify.BadRequestError{
    constructor(message){
        super({message: message});

        this.body.code = 'InvalidInput';

        Error.captureStackTrace(this, BadRequestError);
    }
}

class ResourceNotFoundError extends restify.ResourceNotFoundError{
    constructor(){
        super({message: 'Resource not found'});

        this.body.code = 'ResourceNotFound';

        Error.captureStackTrace(this, ResourceNotFoundError);
    }
}

module.exports.BadRequestError = BadRequestError;

module.exports.ResourceNotFoundError = ResourceNotFoundError;

module.exports.ValidationError = ValidationError;

'use strict';

require('./sequelizeHelpers')

class ValidationError extends Error{
    constructor(sequelizeValidationError){
        super({message: 'Invalid Data'});

        this.message = 'Invalid Data';
        this.name = 'ValidationError';
        this.details = sequelizeValidationError.toFriendlyErrors();

        Error.captureStackTrace(this, ValidationError);
    }
}

module.exports.ValidationError = ValidationError;

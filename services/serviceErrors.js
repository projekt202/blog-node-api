'use strict';

class ValidationError extends Error{
    constructor(sequelizeValidationError){
        super();

        this.message = 'Invalid Data';
        this.name = 'ValidationError';

        /* Assemble all the errors into a new array called details */
        if(sequelizeValidationError.errors){
            this.details = sequelizeValidationError.errors.map(e => {
                return {
                    property: e.path,
                    message:e.message == null ? null : e.message.replace(e.path,'').trim()
                }
            });
        }

        Error.captureStackTrace(this, ValidationError);
    }
}

module.exports.ValidationError = ValidationError;

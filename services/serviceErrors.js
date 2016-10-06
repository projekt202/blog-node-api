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
                };
            });
        }

        Error.captureStackTrace(this, ValidationError);
    }
}

class InvalidUserPassword extends Error {
    constructor() {
        super();

        this.message = 'Invalid User Password';
        this.name = 'InvalidUserPassword';

        Error.captureStackTrace(this, InvalidUserPassword);
    }
}

class InvalidClaim extends Error {
    constructor() {
        super();

        this.message = 'Invalid Claim';
        this.name = 'InvalidUClaim';

        Error.captureStackTrace(this, InvalidClaim);
    }
}

module.exports.ValidationError = ValidationError;
module.exports.InvalidUserPassword = InvalidUserPassword;
module.exports.InvalidClaim = InvalidClaim;
'use strict';

function authorize() {

    function authorizeRequest(req, res, next) {

        if(req.route.path.toLowerCase().includes('userid') && (!req.user || req.user.id.toString() != req.params.userId )){
            res.send(403, {error: 'InsufficientAccountPermissions', message: 'You do not have permission to perform this action.'});
            return next(false);
        }

        return next();
    }

    return (authorizeRequest);
}

module.exports = authorize;

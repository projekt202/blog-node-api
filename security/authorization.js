'use strict';


function authorize(server) {

    function authorizeRequest(req, res, next) {
        let route = server.router.routes[req.method].filter(r => r.spec.path === req.route.path);

        console.log(route);

        var isAnonymous = !route.spec.roles;
        return next();
    }

    return (authorizeRequest);
}

module.exports = authorize;

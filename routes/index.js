'use strict';

//Load all routes from the route directory
function routeInitializer(server) {
    let requireDirectory = require('require-directory'),
        renamer = function (name) {
            return name.toLowerCase();
        },
        visitor = function (route) {
            route(server); //inject the server into the route
        };

    return requireDirectory(module, {visit: visitor, rename: renamer});
}

module.exports = routeInitializer;
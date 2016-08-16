'use strict';

//dynamically require all routes declared in the routes folder
function routeInitializor(server) {
    let requireDirectory = require('require-directory'),
        renamer = function (name) {
            return name.toLowerCase();
        },
        visitor = function (route) {
            route(server); //inject the server into the route
        };

    return requireDirectory(module, {visit: visitor, rename: renamer});
}

module.exports = routeInitializor;
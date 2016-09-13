'use strict';

function routeAuthorizor(){
    function authorizeRouteRequest(request, response, next){
        //authentication logic here, if successful next() proceeds to next function in chain. if not just return
        return next();
    }

    return(authorizeRouteRequest);
}

module.exports = routeAuthorizor;
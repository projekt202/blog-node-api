/**
 * Created by reggie.samuel on 6/24/2016.
 */
'use strict';

function routeAuthenticator(){
    function authenticateRouteRequest(request, response, next){
        //authentication logic here, if successful next() proceeds to next function in chain. if not just return

        return next();
    }

    return(authenticateRouteRequest);
}

module.exports = routeAuthenticator;
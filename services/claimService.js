'use strict';
let ModelManager = require('../models');
let modelManager = new ModelManager();
let Sequelize = require('sequelize');
let nJwt = require('njwt');
let secureRandom = require('secure-random');

class ClaimService {

    create(claim) {
        return new Promise((resolve, reject) => {

            /*Clean out any expired claims*/
            modelManager.models.claim.destroy({
                where: {
                    expiresAt: {
                        $lte: new Date() /* $lte is <= current date/time */
                    }
                }
            }); //Don't wait until this finish to complete next command

            /*Then create the new claim*/
            return modelManager.models.claim.create(claim)
                .then((createdClaim) => {
                    resolve(createdClaim);
                })
                .catch(Sequelize.ValidationError, (validationError) => {
                    reject(new serviceErrors.ValidationError(validationError))

                })
                .catch(reject);
        });
    }

    validateToken(token){
        return new Promise((resolve, reject) => {
            return modelManager.models.claim.findOne({where: {token: token}})
                .then((claim) => {
                    if(!claim){
                        resolve({isValid:false});
                        return;
                    }
                    let signingKey = Buffer.from(claim.signingKey, 'base64');

                    nJwt.verify(token, signingKey, (err,verifiedJwt) => {
                        if(err){
                            resolve({isValid:false}); // Token has expired, has been tampered with, etc
                        }else{
                            resolve({isValid:true, userId: claim.userId});
                        }
                    });

                })
                .catch(reject);
        });
    }

    generateClaim(req, user) {
        let claims = {
            iss: (req.isSecure()) ? 'https' : 'http' + '://' + req.headers.host,  // The URL of your service
            sub: "users/" + user.id,     // The user id of the user in your system
            scope: ""                    // If you have a role based api put the roles here as a comma separated list like "public, admin"
        }

        let signingKey = secureRandom(256, {type: 'Buffer'});
        let jwt = nJwt.create(claims,signingKey);
        let expirationDate = new Date().getTime() + (120*60*1000); // Two hours from now.
        jwt.body.exp = expirationDate;

        return {
            signingKey: signingKey.toString('base64'),
            clientToken: jwt.compact(),
            expirationDate: expirationDate
        }
    }
}


module.exports = ClaimService;
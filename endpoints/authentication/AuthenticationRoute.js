var express = require("express")
var router = express.Router()

var authenticationService = require("./AuthenticationService")

router.get("/", function(req, res, next){
    console.log("Creating login token...")

    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        return res.json({ message: 'Missing Authorization Header Gib die daten' });
    } else {
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        authenticationService.createSessionToken([username, password], function(err, token, user){
            if(token){
                res.header("Authorization", "Bearer " + token)

                if(user){
                    res.status(200).json({Success: "Token succesfuly created"})
                } else {
                    console.log("User is null, even though a token has been created. Error: " + err)
                    res.status(200).json({Success: "Token succesfully created"})
                }
            } else {
                console.log("Token has not been created, Error: " + err)
                res.status(401).json({Error: "Could not create token: Authentication failed"})
            }
        })
    }
})

module.exports = router;
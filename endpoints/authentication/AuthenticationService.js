var express = require("express")
var router = express.Router()
var jwt = require("jsonwebtoken")
var config = require("config")

var userService = require("../user/UserService")

function createSessionToken(props, callback){
    console.log("Auth Service: create token...")
    if(!props){
        console.log("Error: no json body")
        callback("Missing json body", null, null)
        return
    } 

    userService.findUserById(props[0], function(err, user){
        if(user){
            console.log("Found user, checking password...")
            user.comparePassword(props[1], function(err, isMatch){
                if(err){
                    console.log("Password is invalid")
                    callback(err, null)
                } else {
                    console.log("Correct password, creating token...")
                    var issuedAt = new Date().getTime()
                    var expirationTime = config.get("session.timeout")
                    var privateKey = config.get("session.tokenKey")
                    let token = jwt.sign({"user": user.userID}, privateKey, {expiresIn: expirationTime, algorithm: "HS256"})

                    console.log("Token created: " + token)
                    callback(null, token, user)
                }
            })
        } else {
            console.log("Session Services: Didn't find user for id: " + props[0])
            callback("Didn't find user", null)
        }
    })
}

module.exports = {
    createSessionToken
}
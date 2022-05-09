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

    userService.privateFindUserById(props[0], function(err, user){
        if(user){
            console.log("Found user, checking password...")
            user.comparePassword(props[1], function(err, isMatch){
                if(err){
                    console.log("Password is invalid")
                    callback(err, null)
                } else  if (isMatch) {
                    console.log("Correct password, creating token...")
                    var privateKey = config.get("session.tokenKey")
                    let token = jwt.sign({"userID": user.userID, "userName": user.userName, "isAdministrator": user.isAdministrator}, privateKey, {expiresIn: "1h", algorithm: "HS256"})

                    console.log("Token created: " + token)
                    callback(null, token, user)
                } else {
                    console.log("Wrong password.")
                    callback("Wrong password")
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
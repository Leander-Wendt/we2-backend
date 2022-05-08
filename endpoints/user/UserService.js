var express = require("express")
var router = express.Router()
var User = require("./UserModel")

function getUsers(callback){
    User.find(function(err, users){
        if(err) {
            console.log("Error while searching: " + err)
            return callback(err, null)
        } 
        console.log("returning all users...")
        return callback(null, users)
    })
}

function findUserById(searchUserId, callback){
    console.log("UserService: find User by ID: " + searchUserId)
    if(!searchUserId){
        callback("UserID is missing", null)
        return;
    }
    var query = User.findOne({userID: searchUserId})
    query.exec(function(err, user){
        if(err){
            console.log("No user with following userID: " + searchUserId)
            return callback("No user with following userID: " + searchUserId, null)
        } else {
            if(user){
                console.log("Found userID: " + searchUserId)
                callback(null, user)
            } else {                
                if ("admin" == searchUserId){
                    logger.debug("No admin account exists. Create it with deafault password")
                    var adminUser = new User()
                    adminUser.userID = "admin"
                    adminUser.password = "123"
                    adminUser.username = "Default Administrator Account"
                    adminUser.isAdmin = true
                    adminUser.save(function(err){
                        if(err){
                            logger.error("Could not create default admin account: " + err)
                            callback("Could not login into admin account", null)
                        } else {
                            callback(null, adminUser)
                        }
                    })
                } else {
                    callback(null, null)
                }
            }
        }
    })
}

function addUser(req, callback){
    const doc = new User ({
        id: req.body.id,
        userID: req.body.userID,
        userName: req.body.userName,
        password: req.body.password,
        isAdministrator: req.body.isAdministrator
    })
        doc.save((err, result) => {
            if (err){
                callback(err, result)
            } else if (result){
                callback(null, result)
            } else {
                callback(null, null)
            }
        })
        
}

function updateUser(doc, req, callback){
    Object.assign(doc, req.body)
    doc.save((err, result) => {
        if (err){
            callback(err, result)
        } else if (result){
            callback(null, result)
        } else {
            callback(null, null)
        }
    })
}

function deleteUser(uID, callback){
    User.deleteOne({userID: uID}, null, (err, result) => {
        if(err){
            callback(err, null)
        } else {
            callback(null, result.deletedCount)
        }
    })
}

module.exports = {
    getUsers,
    findUserById,
    addUser,
    updateUser,
    deleteUser
}
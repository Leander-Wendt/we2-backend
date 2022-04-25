var express = require("express")
var router = express.Router()
var User = require("./UserModel")

//var mongoose = require('mongoose');
//const UserSchema = require('./UserModel');
//var User = mongoose.model('User', UserSchema);

function getUsers(callback){
    User.find(function(err, users){
        if(err) {
            console.log("Fehler bei Suche: " + err)
            return callback(err, null)
        } 
        console.log("returning all users...")
        console.log(users, typeof users)
        return callback(null, users)
    })
}

function findUserById(searchUserId, callback){
    console.log("UserService: find User by ID: " + searchUserId)

    if(!searchUserId){
        callback("UserID missing")
        return;
    }
    var query = User.findOne({userID: searchUserId})
    query.exec(function(err, user){
        if(err){
            logger.error("No user with following userID: " + searchUserId)
            return callback("No user with following userID: " + searchUserId, null)
        } else {
            if(user){
                logger.debug("Found userID: " + searchUserId)
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
                }
            }
        }
    })
}

function addUser(req, callback){
    console.log("Adding new User...")
    if(findUserById(req.body.userID) != null){
        callback("User mit gewählter ID existiert bereits.", null)
    } else {
        const tempUser = new User ({
            id: req.body.id,
            userID: req.body.userID,
            userName: req.body.userName,
            password: req.body.password,
            isAdministrator: req.body.isAdministrator
        }).save()
        callback(null, tempUser)
    }    
}

// param changes must be json
/*function updateUser(searchUserId, changes, callback){
    const doc = Person.findOne({ searchUserId });

    // Sets `name` and unsets all other properties
    doc.overwrite(changes);
    doc.save();
}*/
module.exports = {
    getUsers,
    findUserById,
    addUser
}
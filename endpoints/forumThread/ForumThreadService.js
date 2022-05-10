var Thread = require("./ForumThreadModel")
var util = require("../../utils/util")

function getThreads(callback){
    Thread.find(function(err, threads){
        if(err) {
            console.log("Error while searching: " + err)
            return callback(err, null)
        } 
        console.log("returning all threads...")
        return callback(null, threads)
    })
}

function findUsersThread(req, callback){
    user = util.readToken(req)
    console.log("ThreadService: getting all Threads from User: " + user.userName)
    if(!user){
        callback("User is missing", null)
        return;
    }
    var query = Thread.find({ownerID: user.userID})
    query.exec(function(err, threads){
        if(err){
            console.log("No user with following userID: " + user.userID)
            return callback("No user with following userID: " + user.userID, null)
        } else {
            if(threads){
                console.log("Found threads by userID: " + user.userID)
                callback(null, threads)
            } else {                
                callback(null, null)
            }
        }
    })
}

function findThreadByUserId(searchUserId, callback){
    console.log("UserService: find User by ID: " + searchUserId)
    if(!searchUserId){
        callback("UserID is missing", null)
        return;
    }
    var query = Thread.find({ownerID: searchUserId})
    query.exec(function(err, threads){
        if(err){
            console.log("No user with following userID: " + searchUserId)
            return callback("No user with following userID: " + searchUserId, null)
        } else {
            if(threads){
                console.log("Returning threads by user" + searchUserId)
                callback(null, threads)
            } else {                
                callback(null, null)
            }
        }
    })
}

function findThreadById(id, callback){
    console.log("ThreadService: find Thread by ID: " + id)
    if(!id){
        callback("ThreadID is missing", null)
        return;
    }
    var query = Thread.findOne({_id: id})//.select("-password -_id -__v -updatedAt -createdAt")
    query.exec(function(err, thread){
        if(err){
            console.log("No thread with following ID: " + id)
            return callback("No thread with following ID: " + id, null)
        } else {
            if(thread){
                console.log("Found ID: " + id)
                callback(null, thread)
            } else {                
                callback(null, null)
            }
        }
    })
}

function addThread(req, callback){
    user = util.readToken(req)
    const doc = new Thread ({
        name: req.body.name,
        description: req.body.description,
        ownerID: user.userID
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

function updateThread(doc, req, callback){
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

function deleteThread(ID, callback){
    Thread.deleteOne({id: ID}, null, (err, result) => {
        if(err){
            callback(err, null)
        } else {
            callback(null, result.deletedCount)
        }
    })
}

module.exports = {
    getThreads,
    findThreadByUserId,
    addThread,
    updateThread,
    deleteThread,
    findUsersThread,
    findThreadById
}
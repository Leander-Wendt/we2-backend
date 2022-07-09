var Message = require("./ForumMessageModel")
var util = require("../../utils/util")

function getMessages(callback){
    Message.find(function(err, threads){
        if(err) {
            console.log("Error while searching: " + err)
            return callback(err, null)
        } 
        console.log("returning all messages...")
        return callback(null, threads)
    })
}

function findUsersThread(req, callback){
    let user = util.readToken(req)
    console.log("ThreadService: getting all Threads from User: " + user.userName)
    if(!user){
        callback("User is missing", null)
        return;
    }
    var query = Message.find({ownerID: user.userID})
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

function findMessagesByThreadID(searchThreadId, callback){
    console.log("MessageService: find Thread by ID: " + searchThreadId)
    if(!searchThreadId){
        callback("ThreadID is missing", null)
        return;
    }
    var query = Message.find({forumThreadID: searchThreadId})
    query.exec(function(err, messages){
        if(err){
            console.log("No thread with following threadID: " + searchThreadId)
            return callback("No thread with following threadID: " + searchThreadId, null)
        } else {
            if(messages){
                console.log("Returning messages by thread" + searchThreadId)
                callback(null, messages)
            } else {                
                callback(null, null)
            }
        }
    })
}

function findMessageByID(id, callback){
    console.log("MessageService: find Message by ID: " + id)
    if(!id){
        callback("MessageID is missing", null)
        return;
    }
    var query = Message.findOne({_id: id})//.select("-password -_id -__v -updatedAt -createdAt")
    query.exec(function(err, message){
        if(err){
            return callback("No message with following ID: " + id, null)
        } else {
            if(message){
                callback(null, message)
            } else {                
                callback(null, null)
            }
        }
    })
}

function addMessage(req, callback){
    let user = util.readToken(req)
    const doc = new Message ({
        forumThreadID: req.body.forumThreadID,
        title: req.body.title,
        text: req.body.text,
        authorID: req.body.authorID
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

function updateMessage(doc, req, callback){
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

function deleteMessage(ID, callback){
    Message.deleteOne({_id: ID}, null, (err, result) => {
        if(err){
            callback(err, null)
        } else {
            callback(null, result.deletedCount)
        }
    })
}

module.exports = {
    getMessages,
    findMessagesByThreadID,
    addMessage,
    updateMessage,
    deleteMessage,
    findUsersThread,
    findMessageByID
}
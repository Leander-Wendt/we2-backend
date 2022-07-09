var express = require("express")
var router = express.Router()
var ForumMessageService = require("./ForumMessageService")
var ForumThreadService = require("../forumThread/ForumThreadService")
var util = require("../../utils/util")

// Read all
router.get("/", (req, res) => {
    let forumThreadID = req.query.forumThreadID
    if (forumThreadID){
        ForumMessageService.findMessagesByThreadID(forumThreadID, (err, result) => {
            if(err){
                res.status(500).json({"Error": err})
            } else if(result){
                res.status(200).json(result)
            } else {
                res.status(500).json({"Error": "Something went wrong"})
            }
        })
    } else {
        ForumMessageService.getMessages((err, result) => {
            if(err){
                res.status(500).json({"Error": err})
            } else if(result){
                res.status(200).json(result)
            } else {
                res.status(500).json({"Error": "Something went wrong"})
            }
        })
}
})

// Read
router.get("/:id", (req, res) => {
    ForumMessageService.findMessageByID(req.params.id, (err, result) => {
        if(err){
            res.status(500).json({"Error": err})
        } else if(result){
            res.status(200).json(result)
        } else {
            res.status(404).json({"Error": "Message with given ID does not exist"})
        }
    })
})

// Create
router.post("/", util.isAuthenticated, (req, res) => {
    ForumThreadService.findThreadById(req.body.forumThreadID, (err, result) => {
        if (err){
            res.status(400).json({"Error": err})
        }
        if (result){
            ForumMessageService.addMessage(req, (error, result) => {
                if(error){
                    res.status(500).json({"Error": error})
                } else if(result){
                    res.status(201).json(result)
                } else {
                    res.status(500).json({"Error": "Message creation failed"})
                }
            })
        }
    })    
})

// Update
router.put("/:id", util.isAuthorized, (req, res) => {
    if(!req.body){
        res.status(400).json({"Error": "Missing user data"})
        return
    }

    ForumMessageService.findMessageByID(req.params.id, (err, doc) => {
        if(err){
            res.status(500).json({"Error": err})
        } else if(!doc){
            res.status(404).json({"Error": "Message with given ID does not exist"})
        } else {
            ForumMessageService.updateMessage(doc, req, (err, result) => {
                if (err){
                    res.status(500).json({"Error": err})
                } else if (result){
                    res.status(200).json(result)
                } else {
                    res.status(500).json({"Error": "Message update failed"})
                }
            })
        }
    })   
})

// Delete
router.delete("/:id", util.isAuthorized, (req, res) => {
    ForumMessageService.deleteMessage(req.params.id, (err, result) => {
        if (err){
            res.status(500).json({"Error": err})
        } else if (result) {
            res.status(204).json({"Success": "Message succesfully deleted"})
        } else {
            res.status(404).json({"Error": "Message with given ID does not exist"})
        }
    })
})

module.exports = router
var express = require("express")
var router = express.Router()
var ForumThreadService = require("./ForumThreadService")
var ForumMessageService = require("../forumMessage/ForumMessageService")
var util = require("../../utils/util")

// Read all
router.get("/", (req, res) => {
    ownerID = req.query.ownerID
    if (ownerID){
        ForumThreadService.findThreadByUserId(ownerID, (err, result) => {
            if(err){
                res.status(500).json({"Error": err})
            } else if(result){
                res.status(200).json(result)
            } else {
                res.status(500).json({"Error": "Something went wrong"})
            }
        })
    } else {
        ForumThreadService.getThreads((err, result) => {
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

// Read all with my OwnerID
router.get("/myForumThreads", util.isAuthenticated, (req, res) => {
    ForumThreadService.findUsersThread(req, (err, result) => {
        if(err){
            res.status(500).json({"Error": err})
        } else if(result){
            res.status(200).json(result)
        } else {
            res.status(404).json({"Error": "Thread with given ID does not exist"})
        }
    })
})

// Read
router.get("/:id", (req, res) => {
    ForumThreadService.findThreadById(req.params.id, (err, result) => {
        if(err){
            res.status(500).json({"Error": err})
        } else if(result){
            res.status(200).json(result)
        } else {
            res.status(404).json({"Error": "Thread with given ID does not exist"})
        }
    })
})

// Create
router.post("/", util.isAuthenticated, (req, res) => {
    ForumThreadService.addThread(req, (error, result) => {
        if(error){
            res.status(500).json({"Error": error})
        } else if(result){
            res.status(201).json(result)
        } else {
            res.status(500).json({"Error": "Thread creation failed"})
        }
    })
})

// Update
router.put("/:id", util.isAuthorized, (req, res) => {
    if(!req.body){
        res.status(400).json({"Error": "Missing user data"})
        return
    }

    ForumThreadService.findThreadById(req.params.id, (err, doc) => {
        if(err){
            res.status(500).json({"Error": err})
        } else if(!doc){
            res.status(404).json({"Error": "Thread with given ID does not exist"})
        } else {
            ForumThreadService.updateThread(doc, req, (err, result) => {
                if (err){
                    res.status(500).json({"Error": err})
                } else if (result){
                    res.status(200).json(result)
                } else {
                    res.status(500).json({"Error": "Thread update failed"})
                }
            })
        }
    })

    
    
})

// Delete
router.delete("/:id", util.isAuthorized, (req, res) => {
    ForumThreadService.deleteThread(req.params.id, (err, result) => {
        if (err){
            res.status(500).json({"Error": err})
        } else if (result) {
            res.status(204).json({"Success": "Thread succesfully deleted"})
        } else {
            res.status(404).json({"Error": "Thread with given ID does not exist"})
        }
    })
})

router.get("/:id/forumMessages", (req, res) => {
    ForumMessageService.findMessagesByThreadID(req.params.id, (err, result) => {
        if(err){
            res.status(400).json({"Error": err})
        } else if(result){
            res.status(200).json(result)
        } else {
            res.status(404).json({"Error": "Thread with given ID does not exist"})
        }
    })
})


module.exports = router
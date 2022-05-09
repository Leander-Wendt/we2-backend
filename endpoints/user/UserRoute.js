var express = require("express")
var router = express.Router()
var userService = require("./UserService")
var util = require("../../utils/util")

// Read all
router.get("/", util.isAuthorized, (req, res) => {
    userService.getUsers((err, result) => {
        if(err){
            res.status(500).json({"Error": err})
        } else if(result){
                res.status(200).json(result)
            } else {
                res.status(500).json({"Error": "Something went wrong"})
            }
    })
})

// Read
router.get("/:id", util.isAuthorized, (req, res) => {
    userService.findUserById(req.params.id, (err, result) => {
        if(err){
            res.status(500).json({"Error": err})
        } else if(result){
            res.status(200).json(result)
        } else {
            res.status(404).json({"Error": "User with given userID does not exist"})
        }
    })
})

// Create
router.post("/", util.isAuthorized, (req, res) => {
    if(!req.body.userID){
        res.status(400).json({"Error": "Missing userID"})
        return
    }
    
    userService.findUserById(req.body.userID, (err, resultA) => {
        if(err){
            res.status(500).json({"Error": err})
        } else if(resultA){
            res.status(400).json({"Error": "A user with the given userID already exists"})
        } else {
            console.log("req:", req)
            userService.addUser(req, (error, resultB) => {
                if(error){
                    res.status(500).json({"Error": error})
                } else if(resultB){
                    res.status(201).json({"Success": "User succesfully created"})
                } else {
                    res.status(500).json({"Error": "User creation failed"})
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

    userService.findUserById(req.params.id, (err, doc) => {
        if(err){
            res.status(500).json({"Error": err})
        } else if(!doc){
            res.status(404).json({"Error": "User with given userID does not exist"})
        } else {
            userService.updateUser(doc, req, (err, result) => {
                if (err){
                    res.status(500).json({"Error": err})
                } else if (result){
                    res.status(202).json({"Success": "User succesfully updated"})
                } else {
                    res.status(500).json({"Error": "User update failed"})
                }
            })
        }
    })

    
    
})

// Delete
router.delete("/:id", util.isAuthorized, (req, res) => {
    userService.deleteUser(req.params.id, (err, result) => {
        if (err){
            res.status(500).json({"Error": error})
        } else if (result) {
            res.status(202).json({"Success": "User succesfully deleted"})
        } else {
            res.status(404).json({"Error": "User with given userID does not exist"})
        }
    })
})

module.exports = router
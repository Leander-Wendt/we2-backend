var express = require("express")
var router = express.Router()
var userService = require("./UserService")
// TODO:
// server mit monbodb verbinden

router.get('/', (req, res) => {
    userService.getUsers(function(err, result){
        console.log("requesting all users Result: " + result)
        if(result){
            res.send(Object.values(result))
        } else {
            res.send("Es gab Probleme")
        }
    })
})

router.get("/:id", (req, res) => {
    userService.findUserById(req.query.id, function(err, result){
        console.log("finding specific user Result: " + result)
        if(result){
            res.send(Object.values(result))
        } else {
            res.send("Dieser Benutzer wurde nicht gefunden")
        }
    })
})

router.post('/', (req, res, next) => {
    userService.addUser(req, function(err, result){
        if(result){
            res.send("Benutzer erfolgreich angegelegt")
        } else {
            res.send("Es gab Probleme")
        }
    })
})

router.put('/:id', (req, res, next) => {
    // versuche einen neuen User zur DB hinzuzufügen
    
})

router.delete("/:id", (req, res) => {
    // returne den user mit ID admin
    //res.json({name: "Hallo Jason"})
    //res.send(req.query.id);
})

module.exports = router;
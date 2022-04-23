var express = require("express")
var router = express.Router()

// TODO:
// server mit monbodb verbinden

router.get('/', (req, res) => {
    // antworte mit einer Liste aus allen Usern 
    res.send("Hallo")
})

router.post('/', (req, res, next) => {
    // versuche einen neuen User zur DB hinzuzufügen
    
})

router.get("/:id", (req, res) => {
    // returne den user mit ID admin
    //res.json({name: "Hallo Jason"})
    res.send(req.params.id);
})

module.exports = router;
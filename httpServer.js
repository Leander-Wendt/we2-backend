const express = require('express')
// const database = require("./database/db")
const bodyParser = require("body-parser")
// const fileUpload = require("express-fileupload")


const publicUsersRoutes = require('./endpoints/publicUsers/publicUsersRoute')

const app = express()
app.use(bodyParser.json())

app.use("/publicUsers", publicUsersRoutes)

// Error Handlong
app.use(function(req, res, next){
    res.status(404).send("Sorry, couldn't find that. This URL isn't supported")
})

app.use(function(req, res, next){
    res.status(500).send("Something broke!")
})

const port = 8080

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
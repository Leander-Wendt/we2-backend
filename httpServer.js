const express = require('express')
const database = require("./database/db")
const bodyParser = require("body-parser")


const publicUsersRoutes = require('./endpoints/publicUsers/publicUsersRoute')
const UserRoutes = require('./endpoints/user/UserRoute')
const authenticationRoutes = require('./endpoints/authenticate/AuthRoute')

const app = express()
app.use(bodyParser.json())

app.use("/publicUsers", publicUsersRoutes)
app.use("/authenticate", authenticationRoutes)
app.use("/users", UserRoutes)

database.initDB(function(err, db){
    if (err){
        console.log("Database error: ", err)
    } else if(db){
        console.log("Database started...")
    } else {
        console.log("Failed to start database")
    }
})

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
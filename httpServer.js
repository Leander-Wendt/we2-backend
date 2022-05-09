const express = require('express')
const database = require("./database/db")
const bodyParser = require("body-parser")


const publicUsersRoutes = require('./endpoints/user/publicUsersRoute')
const UserRoutes = require('./endpoints/user/UserRoute')
const UserService = require('./endpoints/user/UserService')
const authenticationRoutes = require('./endpoints/authentication/AuthenticationRoute')
//const ForumThreadRoutes = require('./endpoints/forumThread/ForumThreadRoutes')
//const ForumMessagesRoutes = require('./endpoints/forumMessage/ForumMessageRoutes')

const app = express()
app.use(bodyParser.json())

app.use("/publicUsers", publicUsersRoutes)
app.use("/authenticate", authenticationRoutes)
app.use("/users", UserRoutes)
//app.use("/forumThreads", ForumThreadRoutes)
//app.use("/forumMessages", ForumMessagesRoutes)

database.initDB(function(err, db){
    if (err){
        console.log("Database error: ", err)
    } else if(db){
        console.log("Database connection established...")
        UserService.createDefaultAdmin((err, admin) => {
            if(admin){
                console.log("Default admin succesfully created!")
            }
        })
    } else {
        console.log("Failed to connect to the database")
    }
})

// Error Handling
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
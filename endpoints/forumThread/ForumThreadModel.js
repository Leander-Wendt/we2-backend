var mongoose = require('mongoose')

const ForumThreadSchema = new mongoose.Schema({
    name: String,
    description: String,
    ownderID: Number
}, { timestamps: true }
);

const ForumThread = mongoose.model("ForumThread", ForumThreadSchema)
module.exports = ForumThread;
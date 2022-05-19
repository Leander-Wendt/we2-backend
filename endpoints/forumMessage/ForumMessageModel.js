var mongoose = require('mongoose')

const ForumMessageSchema = new mongoose.Schema({
    forumThreadID: String,
    title: String,
    text: String, 
    authorID: String
}, { timestamps: true }
);

const ForumMessage = mongoose.model("ForumMessage", ForumMessageSchema)
module.exports = ForumMessage;
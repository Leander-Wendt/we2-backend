var mongoose = require('mongoose')

const ForumMessageSchema = new mongoose.Schema({
    forumThreadID: Number,
    title: String,
    text: String, 
    authorID: Number
}, { timestamps: true }
);

const ForumMessage = mongoose.model("ForumMessage", ForumMessageSchema)
module.exports = ForumMessage;
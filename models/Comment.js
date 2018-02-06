const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    Username: {
        type: String,
        trim: true,
        required: "Username is required to use a comment"
    },
    comment: {
        type: String,
        trim: true,
        required: "Cannot leave a comment without actually writing a comment..."
    },
    commentCreated: {
        type: Date,
        default: Date.now
    }
})

const Comment = mongoose.model("Comment", CommentSchema);

// Export my article model
module.exports = Comment;
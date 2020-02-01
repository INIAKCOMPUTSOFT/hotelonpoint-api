const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  reviewId: {
    type: Schema.Types.ObjectId,
    ref: "Review"
  },
  comment: {
        type: String,
        required: true,
    },
    author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: { type: Date, default: Date.now }
})
const Comment = mongoose.model("Comment", commentSchema);
exports.Comment = Comment;

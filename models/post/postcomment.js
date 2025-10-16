const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true, // each comment belongs to a post
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // who made the comment
    }
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);
module.exports = Comment;

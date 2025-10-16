const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    attachments: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // every post must belong to a user
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // list of users who liked the post
      },
    ],
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);
module.exports = Post;

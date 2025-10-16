const Comment = require("../../models/post/postcomment");

// Get all comments for a post
const getCommentsByPost = async (postId) => {
  return await Comment.find({ postId })
    .populate("userId", "name")
    .sort({ createdAt: -1 });
};

// Get a single comment by ID
const getComment = async (id) => {
  return await Comment.findById(id).populate("userId", "name");
};

// Add a new comment
const addComment = async (content, postId, userId) => {
  const newComment = new Comment({
    content,
    postId,
    userId,
  });
  await newComment.save();
  return newComment;
};

// Update a comment
const updateComment = async (id, content) => {
  return await Comment.findByIdAndUpdate(id, { content }, { new: true });
};

// Delete a comment
const deleteComment = async (id) => {
  return await Comment.findByIdAndDelete(id);
};

module.exports = {
  getCommentsByPost,
  getComment,
  addComment,
  updateComment,
  deleteComment,
};

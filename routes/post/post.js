const express = require("express");
//create a express router
const router = express.Router();

// import all the controller functions
const {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
  toggleLike
} = require("../../controllers/post/post");

const Post = require("../../models/post/post");

/*
 1. List all posts: `GET /posts`
 2. Get specific post details by its ID: `GET /posts/:id`
 3. Add a new post: `POST /posts`
 4. Update a post by its ID: `PUT /posts/:id`
 5. Delete a post by its ID: `DELETE /posts/:id`
*/

const { isValidUser } = require("../../middleware/auth");

// Import controller functions
const {
  getCommentsByPost,
  getComment,
  addComment,
  updateComment,
  deleteComment,
} = require("../../controllers/post/postcomment");

// get all posts
router.get("/", async (req, res) => {
  try {
    const category = req.query.category;
    const sortBy = req.query.sortBy 
    const search = req.query.search

    const posts = await getPosts(category, sortBy, search);
    res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Unknown error" });
  }
});

// get one posts
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await getPost(id);
    res.status(200).send(post);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "unknown error" });
  }
});

router.post("/", isValidUser, async (req, res) => {
  try {
    const title = req.body.title;
    const content = req.body.content;
    const category = req.body.category;
    const attachments = req.body.attachments;
    const user_id = req.user._id; // use from token instead of req.body

    if (!title || !content || !category) {
      return res.status(400).send({
        message: "All the fields are required",
      });
    }

    const post = await addPost(title, content, category, attachments, user_id);
    res.status(200).send(post);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "unknown error" });
  }
});


// update post
router.put("/:id", isValidUser, async (req, res) => {
  try {
    const id = req.params.id;

    // Get the existing post
    const existingPost = await getPost(id);
    if (!existingPost) {
      return res.status(404).send({ message: "Post not found" });
    }

    //  Handle both populated & non-populated userId cases safely
    const existingPost_id =
      typeof existingPost.userId === "object" && existingPost.userId._id //check whether its populated and has an id
        ? existingPost.userId._id.toString() // populated case
        : existingPost.userId.toString();    // normal ObjectId case

    //  Check if the logged-in user is the post owner
    if (existingPost_id !== req.user._id.toString() ){
      return res.status(403).send({ message: "You are not allowed to edit this post" });
    }

    //  Get updated fields from request body
    const title = req.body.title;
    const content = req.body.content;
    const category = req.body.category;
    const attachments = req.body.attachments;

    //  Make sure required fields are not empty
    if (!title || !content || !category) {
      return res.status(400).send({
        message: "All fields are required",
      });
    }

    // Update post using controller function
    const post = await updatePost(id, title, content, category, attachments);
    res.status(200).send(post);

  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Unknown error" });
  }
});



// delete post
router.delete("/:id", isValidUser, async (req, res) => {
  try {
    const id = req.params.id;

    //  Get the existing post
    const existingPost = await getPost(id);
    if (!existingPost) {
      return res.status(404).send({ message: "Post not found" });
    }

    //  Handle both populated & non-populated userId cases safely
    const existingPost_id =
      typeof existingPost.userId === "object" && existingPost.userId._id
        ? existingPost.userId._id.toString() // populated case
        : existingPost.userId.toString();    // normal ObjectId case

    // Verify that the logged-in user is either the owner or an admin
    if (existingPost_id !== req.user._id.toString() || req.user.role !== "admin") {
      return res.status(403).send({ message: "You are not allowed to delete this post" });
    }

    //  Delete the post (controller handles actual deletion)
    await deletePost(id);

    // Send success response
    res.status(200).send({ message: "Post deleted successfully" });

  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Unknown error" });
  }
});


// like or unlike a post
// 🟢 Toggle like on a post
router.patch("/:postId/like", isValidUser, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id; // this comes from the middleware!
    const post = await toggleLike(postId, userId);
    res.status(200).send(post);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Unable to like post" });
  }
});




// Get all comments for a specific post
router.get("/:id/comments", async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await getCommentsByPost(postId);
    res.status(200).send(comments);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch comments" });
  }
});


//    Get a single comment by ID
router.get("/:id/comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await getComment(id);

    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }

    res.status(200).send(comment);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch comment" });
  }
});

//   Add a new comment (user must be logged in)
router.post("/:id/comments", isValidUser, async (req, res) => {
  try {
    const postId = req.params.id;
    const content = req.body.content;

    // Simple validation
    if (!content || content.trim() === "") {
      return res.status(400).send({ message: "Content cannot be empty" });
    }

    // userId comes from the decoded JWT (middleware)
    const userId = req.user._id;

    const comment = await addComment(content, postId, userId);
    res.status(201).send(comment);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to add comment" });
  }
});


  //  Update a comment (only owner can edit)
router.put("/:id/comments/:id", isValidUser, async (req, res) => {
  try {
    const  id = req.params.id;
    const content  = req.body.content;

    if (!content || content.trim() === "") {
      return res.status(400).send({ message: "Content cannot be empty" });
    }

    const comment = await getComment(id);
    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }

    // Only the owner can edit their comment
    if (comment.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "You are not allowed to edit this comment" });
    }

    const updatedComment = await updateComment(id, content);
    res.status(200).send(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to update comment" });
  }
});


//    Delete a comment (owner or admin)
router.delete("/:id/comments/:id", isValidUser, async (req, res) => {
  try {
    const id = req.params.id;
    const comment = await getComment(id);

    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }

    // Only owner or admin can delete
    if (
      req.user.role !== "admin" &&
      comment.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).send({ message: "You are not allowed to delete this comment" });
    }

    await deleteComment(id);
    res.status(200).send({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to delete comment" });
  }
});

module.exports = router;

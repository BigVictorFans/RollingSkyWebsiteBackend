const Post = require('../../models/post/post');
const Category = require('../../models/post/postcategory');


// Get all posts (optionally filtered by category and sorted by newest, mostLikes, or oldest)
const getPosts = async (category, sortBy = "newest", search) => {
  // Create a filter object for category
  let filter = {};
  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  // Set the sort criteria based on `sortBy`
  let sortCriteria = {};
  if (sortBy === "popular") {
    sortCriteria = { likes: -1 }; // Sort by most likes (descending)
  } else if (sortBy === "oldest") {
    sortCriteria = { createdAt: 1 }; // Sort by oldest (ascending)
  } else if (sortBy === "newest") {
    sortCriteria = { createdAt: -1 }; // Default: Sort by newest (createdAt descending)
  }

  // Fetch the posts with dynamic sorting and pagination
  const posts = await Post.find(filter)
    .populate("userId", "name") // Show username of the post author
    .populate("category", "label") // Show category name
    .sort(sortCriteria) // Apply dynamic sorting
  return posts;
};

// 🟣 Get one post by its ID
const getPost = async (id) => {
  // Find post by its unique MongoDB ID
  return await Post.findById(id)
    .populate("userId", "name")
    .populate("category", "name");
};

// 🟡 Add a new post
const addPost = async (title, content, category, attachments, userId) => {
  // Create a new post document
  const newPost = new Post({
    title,
    content,
    category,
    attachments,
    userId,
  });

  // Save to MongoDB
  await newPost.save();
  return newPost;
};


// 🟠 Update a post
const updatePost = async (id, title, content, category, attachments) => {
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      title,
      content,
      category,
      attachments,
    },
    {
      new: true, // return the updated document instead of the old one
    }
  );
  return updatedPost;
};


// 🔴 Delete a post
const deletePost = async (id) => {
  // Remove post by its ID
  return await Post.findByIdAndDelete(id);
};

// 💙 Like or unlike a post
const toggleLike = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  // If user already liked, remove their ID (unlike)
  const alreadyLiked = post.likes.includes(userId);
  if (alreadyLiked) {
    post.likes.pull(userId);
  } else {
    // Otherwise, add their ID (like)
    post.likes.push(userId);
  }

  await post.save();
  return post;
};

module.exports = {
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
  toggleLike,
};

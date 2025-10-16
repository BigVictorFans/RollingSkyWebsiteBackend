const GameReview = require("../models/gamereview");

// Get all reviews (optional ?rating=)
const getGameReviews = async (rating) => {
  const query = {};
  if (rating) {
    query.rating = Number(rating); // convert from string to number
  }
  return await GameReview.find(query)
    .populate("userId", "name")
    .sort({ createdAt: -1 });
};

// Get a single review by ID
const getGameReview = async (id) => {
  return await GameReview.findById(id).populate("userId", "name");
};

// Add a new review
const addGameReview = async (title, content, rating, userId) => {
  const newReview = new GameReview({
    title,
    content,
    rating,
    userId,
  });
  await newReview.save();
  return newReview;
};

// Update a review
const updateGameReview = async (id, title, content, rating) => {
  return await GameReview.findByIdAndUpdate(
    id,
    { title, content, rating },
    { new: true }
  );
};

// Delete a review
const deleteGameReview = async (id) => {
  return await GameReview.findByIdAndDelete(id);
};

module.exports = {
  getGameReviews,
  getGameReview,
  addGameReview,
  updateGameReview,
  deleteGameReview,
};

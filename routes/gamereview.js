const express = require("express");
const router = express.Router();
const {
  getGameReviews,
  getGameReview,
  addGameReview,
  updateGameReview,
  deleteGameReview,
} = require("../controllers/gamereview");

const { isValidUser } = require("../middleware/auth");

// GET all reviews (with optional ?rating=)
router.get("/", async (req, res) => {
  try {
    const rating  = req.query.rating;
    const reviews = await getGameReviews(rating);
    res.status(200).send(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to get reviews" });
  }
});

// GET single review by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const review = await getGameReview(id);
    if (!review) return res.status(404).send({ message: "Review not found" });
    res.status(200).send(review);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to get review" });
  }
});

// POST new review (user must be logged in)
router.post("/", isValidUser, async (req, res) => {
  try {
    const { title, content, rating } = req.body;

    if (!title || !content || !rating)
      return res.status(400).send({ message: "All fields required" });

    const userId = req.user._id; // from JWT
    const review = await addGameReview(title, content, rating, userId);
    res.status(201).send(review);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to add review" });
  }
});

// PUT update review (only owner)
router.put("/:id", isValidUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, rating } = req.body;

    const review = await getGameReview(id);
    if (!review) return res.status(404).send({ message: "Review not found" });

    if (review.userId._id.toString() !== req.user._id.toString())
      return res.status(403).send({ message: "Not allowed" });

    const updated = await updateGameReview(id, title, content, rating);
    res.status(200).send(updated);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to update review" });
  }
});

// DELETE review (only owner)
router.delete("/:id", isValidUser, async (req, res) => {
  try {
    const { id } = req.params;
    const review = await getGameReview(id);
    if (!review) return res.status(404).send({ message: "Review not found" });

    if (review.userId._id.toString() !== req.user._id.toString())
      return res.status(403).send({ message: "Not allowed" });

    await deleteGameReview(id);
    res.status(200).send({ message: "Review deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to delete review" });
  }
});

module.exports = router;

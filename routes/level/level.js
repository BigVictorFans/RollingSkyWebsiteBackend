const express = require("express");
//create a express router
const router = express.Router();

// import all the controller functions
const {
  getLevels,
  getLevel,
  addLevel,
  updateLevel,
  deleteLevel,
} = require("../../controllers/level/level");

const { isAdmin } = require("../../middleware/auth");
const { isValidUser } = require("../../middleware/auth");

const{
  getReview,
  getReviewsByLevel,
  addLevelReview,
  updateReview,
  deleteReview
} = require("../../controllers/level/levelreview");

/*
 1. List all levels: `GET /levels`
 2. Get specific level details by its ID: `GET /levels/:id`
 3. Add a new level: `POST /levels`
 4. Update a level by its ID: `PUT /levels/:id`
 5. Delete a level by its ID: `DELETE /levels/:id`
*/

// get all levels
router.get("/", async (req, res) => {
  try {
    const difficulty = req.query.difficulty;
    const levels = await getLevels(difficulty);
    res.status(200).send(levels);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "unknown error" });
  }
});

// get one levels
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const level = await getLevel(id);
    res.status(200).send(level);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "unknown error" });
  }
});

// add new level
router.post("/", isAdmin, async (req, res) => {
  try {
    console.log(req.user); 
    const title = req.body.title;
    const description = req.body.description;
    const baseDifficulty = req.body.baseDifficulty;
    const perfectDifficulty = req.body.perfectDifficulty;
    const releaseDate = req.body.releaseDate;
    const levelThumbnail = req.body.levelThumbnail;

    // check error - make sure all the fields are not empty
    if (!title || !description || !baseDifficulty || !perfectDifficulty || !releaseDate || !levelThumbnail) {
      return res.status(400).send({
        message: "All the fields are required",
      });
    }

    const level = await addLevel(title, description, baseDifficulty, perfectDifficulty, releaseDate, levelThumbnail, );
    res.status(200).send(level);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "unknown error" });
  }
});

// update level
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const title = req.body.title;
    const description = req.body.description;
    const baseDifficulty = req.body.baseDifficulty;
    const perfectDifficulty = req.body.perfectDifficulty;
    const releaseDate = req.body.releaseDate;
    const levelThumbnail = req.body.levelThumbnail;

    // check error - make sure all the fields are not empty
    if (!title || !description || !baseDifficulty || !perfectDifficulty || !releaseDate || !levelThumbnail) {
      return res.status(400).send({
        message: "All the fields are required",
      });
    }

    const level = await updateLevel(
      id, 
      title, 
      description, 
      baseDifficulty, 
      perfectDifficulty, 
      releaseDate, 
      levelThumbnail
    );
    res.status(200).send(level);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "unknown error" });
  }
});

// delete level
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    await deleteLevel(id);
    res.status(200).send({
      message: `Level with the ID of ${id} has been deleted`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "unknown error" });
  }
});

// Get all level reviews for a specific level
router.get("/:id/reviews", async (req, res) => {
  try {
    const levelId = req.params.id;
    const reviews = await getReviewsByLevel(levelId);
    res.status(200).send(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch reviews" });
  }
});


// Get a single level review by ID
router.get("/:id/reviews/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const review = await getReview(id);

    if (!review) {
      return res.status(404).send({ message: "reviews not found" });
    }

    res.status(200).send(review);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch reviews" });
  }
});

//   Add a new level review (user must be logged in)
router.post("/:id/reviews", isValidUser, async (req, res) => {
  try {
    const userId = req.user._id; // userId comes from the decoded JWT (middleware)
    const levelId = req.params.id;
    const content = req.body.content;
    const fanDifficultyBase = req.body.fanDifficultyBase;
    const fanDifficultyPerfect = req.body.fanDifficultyPerfect;

    // Simple validation
    if (!content || content.trim() === "" || !fanDifficultyBase || !fanDifficultyPerfect) {
      return res.status(400).send({ message: "Please fill out the fields" });
    }

    const review = await addLevelReview(content, fanDifficultyBase, fanDifficultyPerfect, userId, levelId,);
    res.status(201).send(review);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to add reviews" });
  }
});


  //  Update a reviews (only owner can edit)
router.put("/:id/reviews/:id", isValidUser, async (req, res) => {
  try {
    const  id = req.params.id;
    const content  = req.body.content;
    const fanDifficultyBase = req.body.fanDifficultyBase;
    const fanDifficultyPerfect = req.body.fanDifficultyPerfect

   // Simple validation
    if (!content || content.trim() === "" || !fanDifficultyBase || !fanDifficultyPerfect) {
      return res.status(400).send({ message: "Please fill out the fields" });
    }

    const review = await getReview(id);
    if (!review) {
      return res.status(404).send({ message: "review not found" });
    }

    // Only the owner can edit their review
    if (review.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "You are not allowed to edit this review" });
    }

    const updatedReview = await updateReview(id, content, fanDifficultyBase, fanDifficultyPerfect);
    res.status(200).send(updatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to update review" });
  }
});


//    Delete a review (owner or admin)
router.delete("/:id/reviews/:id", isValidUser, async (req, res) => {
  try {
    const id = req.params.id;
    const review = await getReview(id);

    if (!review) {
      return res.status(404).send({ message: "review not found" });
    }

    // Only owner or admin can delete
    if (
      req.user.role !== "admin" &&
      review.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).send({ message: "You are not allowed to delete this review" });
    }

    await deleteReview(id);
    res.status(200).send({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to delete review" });
  }
});

module.exports = router;

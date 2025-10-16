const LevelReview = require("../../models/level/levelreview");

const getReview = async (id) => {
  return await LevelReview.findById(id);
};

// Get all comments for a post
const getReviewsByLevel = async (levelId) => {
  return await LevelReview.find({ levelId })
    .populate("userId", "name")
    .sort({ createdAt: -1 });
};


const addLevelReview = async (content, fanDifficultyBase, fanDifficultyPerfect, userId, levelId) => {
  const newReview = new LevelReview({
    content,
    fanDifficultyBase,
    fanDifficultyPerfect,
    userId,
    levelId
  });

  await newReview.save();
  return newReview;
};

const updateReview = async (id, content, fanDifficultyBase, fanDifficultyPerfect) => {
  return await LevelReview.findByIdAndUpdate(
    id,
    { 
      content,
      fanDifficultyBase,
      fanDifficultyPerfect,
    },
    { new: true }
  );
}



const deleteReview = async (id) => {
  return await LevelReview.findByIdAndDelete(id);
};

module.exports = {
  getReview,
  getReviewsByLevel,
  addLevelReview,
  updateReview,
  deleteReview
};
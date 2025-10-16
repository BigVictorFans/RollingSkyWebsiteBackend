const { Schema, model } = require("mongoose");

const levelReviewSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    fanDifficultyBase: {
      type: Number,
      min: 1.0,
      max: 8.0,
    },
    fanDifficultyPerfect: {
      type: Number,
      min: 1.0,
      max: 8.0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    levelId: {
      type: Schema.Types.ObjectId,
      ref: "Level",
      required: true,
    }
  },
  { timestamps: true }
);

const LevelReview = model ("LevelReview", levelReviewSchema);
module.exports = LevelReview;

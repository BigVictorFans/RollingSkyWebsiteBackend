const { Schema, model } = require("mongoose");

const gameReviewSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
        min: 1,
        max: 5
    },
    
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const gameReview = model ("gameReview", gameReviewSchema);
module.exports = gameReview;
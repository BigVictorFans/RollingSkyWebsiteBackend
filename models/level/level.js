const { Schema, model } = require("mongoose");

const levelSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    baseDifficulty: {
      type: Number,
      min: 1.0,
      max: 7.0,
      required: true,

    },
    perfectDifficulty: {
      type: Number,
      min: 1.0,
      max: 8.0,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    levelThumbnail:{
        type: String,
        required: true,
    },
    difficultyLevel: {
      type: String,
      enum: ["veryeasy", "easy", "normal", "hard", "veryhard", "extreme"], // only allow these values
      default: "veryeasy",
      required: true,
  }, //just for controller to sort the difficulties easier
  },
  { timestamps: true }
);

const Level = model("Level", levelSchema);
module.exports = Level
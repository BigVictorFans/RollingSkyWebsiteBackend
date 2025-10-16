// controllers/levelController.js
const Level = require("../../models/level/level");

const getLevels = async (difficulty) => {
  const filter = {};

  if (difficulty) {
    filter.difficultyLevel = difficulty;
  }

  return await Level.find(filter)
    .sort({ baseDifficulty: 1 })
};


const getLevel = async (id) => {
  return await Level.findById(id);
};


const addLevel = async (title, description, baseDifficulty, perfectDifficulty, releaseDate, levelThumbnail, difficultyLevel ) => {

  // Assign difficulty type automatically based on baseDifficulty
  if (baseDifficulty >= 1 && baseDifficulty < 2) {
    difficultyLevel = "veryeasy";
  }
  else if (baseDifficulty >= 2 && baseDifficulty < 3) {
    difficultyLevel = "easy";
  } else if (baseDifficulty >= 3 && baseDifficulty < 4) {
    difficultyLevel = "normal";
  } else if (baseDifficulty >= 4 && baseDifficulty < 5) {
    difficultyLevel = "hard";
  } else if (baseDifficulty >= 5 && baseDifficulty < 6) {
    difficultyLevel = "veryhard";
  } else if (baseDifficulty >= 6) {
    difficultyLevel = "extreme";
  }

  // create new Level
  const newLevel = new Level({
    title,
    description,
    baseDifficulty,
    perfectDifficulty,
    releaseDate,
    levelThumbnail,
    difficultyLevel
    
  });
  // save into mongodb
  await newLevel.save();
  return newLevel;
};

// 🟠 UPDATE a level
const updateLevel = async (id, title, description, baseDifficulty, perfectDifficulty, releaseDate, levelThumbnail, ) => {
  const updatedLevel = await Level.findByIdAndUpdate(
    id,
    {
        title,
        description,
        baseDifficulty,
        perfectDifficulty,
        releaseDate,
        levelThumbnail,
        
    },
    {
      new: true,
    }
  );
  return updatedLevel;
};

// 🔴 DELETE a level
const deleteLevel = async (id) => {
  return await Level.findByIdAndDelete(id);
};

module.exports = {
  getLevels,
  getLevel,
  addLevel,
  updateLevel,
  deleteLevel,
};
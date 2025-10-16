const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
  label: {
    type: String,
    required: true,
  },
});

const Category = model("Category", categorySchema);
module.exports = Category;
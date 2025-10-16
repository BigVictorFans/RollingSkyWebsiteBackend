const { Schema, model } = require("mongoose");

const updateLogsSchema = new Schema({
  version: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const UpdateLog = model("updatelogs", updateLogsSchema);
module.exports = UpdateLog;
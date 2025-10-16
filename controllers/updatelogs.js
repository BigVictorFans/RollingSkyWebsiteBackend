const Updatelog = require("../models/updatelogs");

const getUpdatelogs = async () => {
  const updatelogs = await Updatelog.find().sort({ date:-1 });
  return updatelogs;
};

const getUpdateLog = async (id) => {
  return await Updatelog.findById(id);
}

const addUpdateLog = async (version, content, date) => {
  // create new category in mongodb
  const newUpdateLog = new Updatelog({
    version,
    content,
    date,
  });
  await newUpdateLog.save();

  return newUpdateLog;
};

const updateUpdateLog = async (id, version, content, date) => {
  const updatedUpdateLog = await Updatelog.findByIdAndUpdate(
    id,
    {
        version,
        content,
        date,
    },
    {
      new: true,
    }
  );
  return updatedUpdateLog;
};

const deleteUpdateLog = async (id) => {
  return await Updatelog.findByIdAndDelete(id);
};

module.exports = {
    getUpdatelogs,
    getUpdateLog,
    addUpdateLog,
    updateUpdateLog,
    deleteUpdateLog,
};

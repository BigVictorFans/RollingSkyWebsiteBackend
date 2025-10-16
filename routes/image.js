const express = require("express");
const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  // rename of the image file to make sure it's unique
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname.replace(/\s+/g, "_"));
    // 1756344803684_this_is_fine.jpg
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const image_url = req.file.path;
    // send back the image url
    res.status(200).send({ image_url: image_url });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Unable to upload image" });
  }
});

module.exports = router;

const express = require("express");
// set up updatelog by id router
const router = express.Router();

const {
    getUpdatelogs,
    getUpdateLog,
    addUpdateLog,
    updateUpdateLog,
    deleteUpdateLog,
} = require("../controllers/updatelogs");


const { isAdmin } = require("../middleware/auth");


/*
    GET /updatelog
    GET /updatelog/:id
    POST /updatelog
    PUT /updatelog/:id
    DELETE /updatelog/:id
*/



// get updatelogs
router.get("/", async (req, res) => {
  try {
    const updatelogs = await getUpdatelogs();
    res.status(200).send(updatelogs);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Unknown error" });
  }
});

// get updatelog by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatelog = await getUpdateLog(id);
    res.status(200).send(updatelog);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Unknown error" });
}
});



// create new updatelog by id
router.post("/", isAdmin, async (req, res) => {
  try {
    console.log(req.body);
    const version = req.body.version;
    const content = req.body.content;
    const date = req.body.date;

    if (!version || !content || !date) {
        return res.status(400).send({
            message: "All the fields are required",
        });
    }

    const newUpdateLog = await addUpdateLog(version, content, date);
    res.status(200).send(newUpdateLog);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Unknown error" });
  }
});

// update updatelog by id
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const version = req.body.version;
    const content = req.body.content;
    const date = req.body.date;

    if (!version || !content || !date) {
        return res.status(400).send({
            message: "All the fields are required",
        });
    }
    const updatedUpdateLog = await updateUpdateLog(id, version, content, date);
    res.status(200).send(updatedUpdateLog);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Unknown error" });
  }
});

// delete updatelog by id
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    await deleteUpdateLog(id);
    res.status(200).send({
      message: `Update #${id} has been deleted`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Unknown error" });
  }
});

module.exports = router;

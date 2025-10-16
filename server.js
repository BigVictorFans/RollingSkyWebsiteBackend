// load the environment variables
require("dotenv").config();

const express = require("express");
// import mongoose
const mongoose = require("mongoose");
const cors = require("cors");

// setup an express app
const app = express();
// setup a middleware to handle JSON request
app.use(express.json());

// setup cors policy
app.use(cors());

// connect to MongoDB using Mongoose
async function connectToMongoDB() {
  try {
    // wait for the MongoDB to connect
    await mongoose.connect(process.env.MONGODB_URL + "rollingsky");
    console.log("MongoDB is Connected");
  } catch (error) {
    console.log(error);
  }
}

// trigger the connection with MongoDB
connectToMongoDB();

// setup root route
app.get("/api", (req, res) => {
  res.send("Happy coding!");
});

// import all the routers
app.use("/api/users", require("./routes/user"));
app.use("/api/levels", require("./routes/level/level"));
app.use("/api/updatelogs", require("./routes/updatelogs"));
app.use("/api/posts", require("./routes/post/post"));
app.use("/api/postcategories", require("./routes/post/postcategory"));
app.use("/api/gamereviews", require("./routes/gamereview"));
app.use("/api/image", require("./routes/image"));


//folder static path
app.use('/api/uploads', express.static('uploads'));

// start the express server
app.listen(5123, () => {
  console.log("server is running at http://localhost:5123");
});

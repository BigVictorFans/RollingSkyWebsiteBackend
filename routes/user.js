const express = require("express");
const router = express.Router();

const { login, signup, getUser, getUsers, updateUser, deleteUser, getUserByEmail } = require("../controllers/user");

/*
    POST /users/signup
    POST /users/login
*/

const { isValidUser, isAdmin } = require("../middleware/auth");

// POST /users/login
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await login(email, password);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});

// POST /users/signup
router.post("/signup", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const user = await signup(name, email, password);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
});


// GET /users — Get all users (Admin only)
router.get("/", async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Unknown error" });
  }
});


// GET /users/:id — Get one user by ID (any logged-in user)
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await getUser(id);

    // If user does not exist, send 404
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Return the found user
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Unknown error" });
  }
});


// PUT /users/:id — Update a user (Admin only)
router.put("/:id", isValidUser, isAdmin,  async (req, res) => {
  try {
    const id = req.params.id; // user ID from URL
    const name = req.body.name;
    const email = req.body.email;
    const role = req.body.role;
    // Validate input
    if (!name || !email || !role) {
      return res.status(400).send({ message: "please fill out the fields" });
    }

    const user = await updateUser(id, name, email, role);
    // If user not found, return 404
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Unknown error" });
  }
});


// DELETE /users/:id — Delete a user (Admin OR same user)
router.delete("/:id", isValidUser, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await getUser(id);

    // If user not found, return 404
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check if the user making the request is either:
    // 1. the same user whose account is being deleted
    // 2. or an admin
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).send({ message: "You are not allowed to delete this user" });
    }

    // Proceed to delete user
    await deleteUser(id);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Unknown error" });
  }
});

// Export all the routes
module.exports = router;


module.exports = router;

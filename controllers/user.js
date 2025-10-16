const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const getUserByEmail = async (email) => {
  return await User.findOne({ email: email });
};

const login = async (email, password) => {
  // 1. check if the email provided is in the system
  const user = await User.findOne({ email: email });
  // if not exists, throw an error
  if (!user) {
    throw new Error("Invalid email or password");
  }
  // if exists, compare the password
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  // generate the JWT token
  let token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET, // secret
    { expiresIn: 60 * 60 * 8 } // expires after 8 hours
  );

  // if password is correct, return the user data
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: token,
  };
};

const signup = async (name, email, password) => {
  // 1. check if the email provided is already exists or not
  const emailExists = await User.findOne({ email: email });
  // if email exists, throw an error
  if (emailExists) {
    throw new Error(
      "Email already exists. Please use another email or login with your existing email"
    );
  }
  // 2. create the new user
  const newUser = new User({
    name: name,
    email: email,
    password: bcrypt.hashSync(password, 10), // hash the password
  });
  // 3. save the user
  await newUser.save();

  // 4. generate the JWT tokens
  let token = jwt.sign(
    {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
    process.env.JWT_SECRET, // secret
    { expiresIn: 60 * 60 * 8 } // expires after 8 hours
  );

  // 5. return the user data
  return {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    token: token,
  };
};


// 🟢 Get all users (admin only)
const getUsers = async () => {
  // Get all users but remove their passwords from the results
  return await User.find().select("-password");
};

// 🟣 Get one user by ID
const getUser = async (id) => {
  // Find a user by their MongoDB ID, but don't return password
  return await User.findById(id).select("-password");
};

// 🟡 Update user (admin only)
const updateUser = async (id, name, email, role) => {
  // Find the user and update the fields given
  // `{ new: true }` makes Mongoose return the *updated* document
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
       name, 
       email, 
       role
    },
    { 
      new: true 
    }
  ).select("-password"); // exclude password field
  return updatedUser;
};

// 🔴 Delete user (admin or same user)
const deleteUser = async (id) => {
  // Delete user by ID
  return await User.findByIdAndDelete(id);
};



module.exports = {
  login,
  signup,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserByEmail,
};

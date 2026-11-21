const User = require("../models/user.Model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// const user.Model = require("../models/user.Model");
require("dotenv").config({
  path: "../.env",
});

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    const id = user._id;
    const { first_name, last_name, plates } = user;

    res.status(200).json({ first_name, last_name, plates, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
  //   res.json({ mssg: "login user" });
};

const signup = async (req, res) => {
  // res.json({ mssg: "signup user" });
  const { first_name, last_name, plates, email, password } = req.body;
  // const link_id = crypto.randomBytes(16).toString("hex");
  // console.log(req.body);

  try {
    const user = await User.signup(
      first_name,
      last_name,
      plates,
      email,
      password,
    );
    if (!user) {
      return res.status(400).json({ error: "Can't create user" });
    }

    const token = createToken(user._id);
    const id = user._id;
    res.status(200).json({ id, first_name, last_name, plates, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message);
  }
};

const getUser = async (req, res) => {
  // console.log("ddddddd");
  const id = req.params.id;
  console.log(id);
  try {
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.log("Error: ", error);
  }
};

const getAll = async (req, res) => {
  try {
    const users = await User.find().sort({ created_at: -1 });
    if (!users) {
      res.status(400).json({ error: "No users found" });
    }
    res.status(200).json(users);
  } catch (err) {
    throw new Error(err);
  }
};

const updateUser = async (req, res) => {
  try {
    const { plates } = req.params;
    const updatedUser = await User.findOne({ plates: plates });

    if (!updatedUser) {
      return res
        .status(400)
        .json({ error: "There is no user with this number" });
    }

    updatedUser.status = !updatedUser.status;

    await updatedUser.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { login, signup, getUser, getAll, updateUser };

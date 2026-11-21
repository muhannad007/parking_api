const express = require("express");
const {
  signup,
  login,
  getUser,
  getAll,
  updateUser,
} = require("../controllers/user.Controller");

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.get("/users", getAll);

router.get("/:id", getUser);

router.put("/status/:plates", updateUser);

module.exports = router;

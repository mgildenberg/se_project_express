const router = require("express").Router();
const { application } = require("express");
const {
  getUsers,
  createUser,
  getUser,
  login,
} = require("../controllers/users");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
router.post("/signup", createUser);
router.post("/signin", login);
// router.post("/", createUser);

module.exports = router;

// router.get("/users/:userId", () => console.log("GET users"));

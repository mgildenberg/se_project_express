const router = require("express").Router();
const { application } = require("express");
const {
  getUsers,
  createUser,
  getUser,
  login,
  getCurrentUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/signup", createUser);
// router.post("/signin", login);
// router.post("/", createUser);

router.get("/me", auth, getCurrentUser);

module.exports = router;

// router.get("/users/:userId", () => console.log("GET users"));

const router = require("express").Router();
const { DOCUMENT_NOT_FOUND_ERROR } = require("../utils/errors");
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const likeRouter = require("./likes");
const {
  getUsers,
  createUser,
  getUser,
  login,
} = require("../controllers/users");

const auth = require("../middlewares/auth");

// router.use(auth);

router.post("/signup", createUser);
router.post("/signin", login);
// router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);
router.use("/items", likeRouter);

router.use((req, res) => {
  res
    .status(DOCUMENT_NOT_FOUND_ERROR)
    .send({ message: "Requested resource not found" });
});

module.exports = router;

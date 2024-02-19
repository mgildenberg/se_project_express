const router = require("express").Router();
const { DOCUMENT_NOT_FOUND_ERROR } = require("../utils/errors");
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const likeRouter = require("./likes");
const { createUser, login } = require("../controllers/users");

const auth = require("../middlewares/auth");

router.post("/signup", createUser);
router.post("/signin", login);
router.use("/items", auth, clothingItemsRouter);
router.use("/items", auth, likeRouter);
router.use("/users", auth, userRouter);

router.use((req, res) => {
  res
    .status(DOCUMENT_NOT_FOUND_ERROR)
    .send({ message: "Requested resource not found" });
});

module.exports = router;

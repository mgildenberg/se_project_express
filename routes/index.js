const router = require("express").Router();

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const likeRouter = require("./likes");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);
router.use("/items", likeRouter);

router.use((req, res) => {
  res.status(500).send({ message: "Requested resource not found" });
});

module.exports = router;

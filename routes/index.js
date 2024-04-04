const router = require("express").Router();
const { DOCUMENT_NOT_FOUND_ERROR } = require("../utils/errors");
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const likeRouter = require("./likes");
const { createUser, login } = require("../controllers/users");
const {
  userRegistrationValidation,
  userLoginValidation,
} = require("../middlewares/validation");

router.post("/signup", userRegistrationValidation, createUser);
router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
router.post("/signin", userLoginValidation, login);
router.use("/items", clothingItemsRouter);
router.use("/items", likeRouter);
router.use("/users", userRouter);

router.use((req, res) => {
  res
    .status(DOCUMENT_NOT_FOUND_ERROR)
    .send({ message: "Requested resource not found" });
});

module.exports = router;

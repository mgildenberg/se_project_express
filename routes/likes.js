const router = require("express").Router();
const { updateLike, deleteLike } = require("../controllers/likes");
const auth = require("../middlewares/auth");

router.put("/:itemId/likes", auth, updateLike);
router.delete("/:itemId/likes", auth, deleteLike);

module.exports = router;

// router.get("/users/:userId", () => console.log("GET users"));

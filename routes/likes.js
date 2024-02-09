const router = require("express").Router();
const { updateLike, deleteLike } = require("../controllers/likes");

router.put("/:itemId/likes", updateLike);
router.delete("/:itemId/likes", deleteLike);

module.exports = router;

// router.get("/users/:userId", () => console.log("GET users"));

const router = require("express").Router();
const { updateLike, deleteLike } = require("../controllers/likes");
const auth = require("../middlewares/auth");
const { clothingIdValidation } = require("../middlewares/validation");

router.put("/:itemId/likes", auth, clothingIdValidation, updateLike);
router.delete("/:itemId/likes", auth, clothingIdValidation, deleteLike);

module.exports = router;

// router.get("/users/:userId", () => console.log("GET users"));

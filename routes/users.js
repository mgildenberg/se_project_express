const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { userUpdateValidation } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, userUpdateValidation, updateCurrentUser);

module.exports = router;

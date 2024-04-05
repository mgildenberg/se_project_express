const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  getClothingItemById,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const {
  createClothingItemValidation,
  clothingIdValidation,
} = require("../middlewares/validation");

router.get("/", getClothingItems);
router.get("/:itemId", getClothingItemById);
router.post("/", auth, createClothingItemValidation, createClothingItem);
// router.get("/:itemId, getUser);
router.delete("/:itemId", auth, clothingIdValidation, deleteClothingItem);

module.exports = router;

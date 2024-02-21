const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  getClothingItemById,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

router.get("/", getClothingItems);
router.get("/:itemId", getClothingItemById);
router.post("/", auth, createClothingItem);
// router.get("/:itemId, getUser);
router.delete("/:itemId", auth, deleteClothingItem);

module.exports = router;

const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.post("/", createClothingItem);
// router.get("/:itemId, getUser);
router.delete("/:itemId", deleteClothingItem);

module.exports = router;

// router.get("/users/:userId", () => console.log("GET users"));

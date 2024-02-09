const ClothingItem = require("../models/clothingItem");
const {
  VALIDATION_ERROR,
  DOCUMENT_NOT_FOUND_ERROR,
  CAST_ERROR,
} = require("../utils/errors");

// PUT /items/:itemId/likes — like an item
// DELETE /items/:itemId/likes — unlike an item

const updateLike = (req, res) => {
  console.log(req);
};

const deleteLike = (req, res) => {
  console.log(req);
};

module.exports = { updateLike, deleteLike };

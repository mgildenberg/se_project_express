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
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail()
    .then((like) => {
      res.send({ data: like });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(DOCUMENT_NOT_FOUND_ERROR)
          .send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(CAST_ERROR).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteLike = (req, res) => {
  console.log(req);
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .orFail()
    .then((like) => {
      res.send({ data: like });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(DOCUMENT_NOT_FOUND_ERROR)
          .send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(CAST_ERROR).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { updateLike, deleteLike };

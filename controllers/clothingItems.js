// EDIT ME
const ClothingItem = require("../models/clothingItem");
const {
  VALIDATION_ERROR,
  DOCUMENT_NOT_FOUND_ERROR,
  CAST_ERROR,
} = require("../utils/errors");

// GET /items
const getClothingItems = (req, res) => {
  ClothingItem.find({}) // would return all the clothingItems
    .then((clothingItems) => res.status(200).send(clothingItems))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createClothingItem = (req, res) => {
  console.log("req", req);
  console.log("req body", req.body);
  const { name, weather, imageUrl } = req.body;
  const userId = req.user._id;
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: userId,
  })
    .then((clothingItem) => {
      res.status(201).send({ clothingItem });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        return res.status(VALIDATION_ERROR).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteClothingItem = (req, res) => {
  const { clothingItemId } = req.params;

  ClothingItem.findByIdAndDelete(clothingItemId)
    .orFail()
    .then((clothingItem) => {
      res.status(SUCCESS).send(clothingItem);
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

module.exports = { getClothingItems, createClothingItem, deleteClothingItem };
module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id); // _id will become accessible
};

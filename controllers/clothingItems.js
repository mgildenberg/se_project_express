// EDIT ME
const ClothingItem = require("../models/clothingItem");

// GET /items
const getClothingItems = (req, res) => {
  ClothingItem.find({}) // would return all the clothingItems
    .then((clothingItems) => res.status(200).send(clothingItems))
    .catch((err) => {
      console.error(err);
      return res.status(500).send(err.message);
    });
};

const createClothingItem = (req, res) => {
  console.log("req", req);
  console.log("req body", req.body);
  // const { name, weather, imageUrl, owner, likes, createdAt } = req.body;
  const { name, weather, imageUrl, userId, likes, createdAt } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: userId,
    likes,
    createdAt,
  })
    .then((clothingItem) => {
      res.status(201).send(clothingItem);
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        return res.status(400).send(err.message);
      }
      return res.status(500).send(err.message);
    });
};

const deleteClothingItem = (req, res) => {
  const { clothingItemId } = req.params;

  ClothingItem.findByIdAndDelete(clothingItemId)
    .orFail()
    .then((clothingItem) => {
      res.status(200).send(clothingItem);
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send(err.message);
      } else if (err.name === "CastError") {
        return res.status(500).send(err.message);
      }
      return res.status(500).send(err.message);
    });
};

module.exports = { getClothingItems, createClothingItem, deleteClothingItem };
module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id); // _id will become accessible
};

const ClothingItem = require("../models/clothingItem");
const {
  CREATED,
  VALIDATION_ERROR,
  CAST_ERROR,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItem.find({}) // would return all the clothingItems
    .then((clothingItems) => res.send({ clothingItems }))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// used this to test
const getClothingItemById = (req, res) => {
  const clothingItemId = req.params.itemId;

  ClothingItem.findById(clothingItemId)
    .orFail(() => {
      const error = new Error(
        ` No item found with the given ID: ${clothingItemId}`,
      );
      error.status = 404;
      error.name = "ItemNotFoundError";
      throw error;
    })
    .then((clothingItem) => {
      res.send({ clothingItem });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ItemNotFoundError") {
        return res.status(err.status).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(CAST_ERROR)
          .send({ message: `${err.name} | ID did not match expected format` });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: err.name + err.message });
    });
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const userId = req.user._id;
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: userId,
  })
    .then((clothingItem) => {
      res.status(CREATED).send({ clothingItem });
      console.log({ clothingItem });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        return res
          .status(VALIDATION_ERROR)
          .send({ message: `${err.name} | ${err.message}` });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const deleteClothingItem = (req, res) => {
  const clothingItemId = req.params.itemId;

  ClothingItem.findByIdAndRemove(clothingItemId)
    .orFail(() => {
      const noIdFoundError = new Error(
        ` No item found with the given ID: ${req.params.itemId}`,
      );

      noIdFoundError.name = "NoIdFoundError";
      noIdFoundError.status = 404;
      throw noIdFoundError;
    })
    // .orFail()
    .then((clothingItem) => {
      res.send({ clothingItem });
    })
    .catch((err) => {
      console.log(err.name);
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(CAST_ERROR)
          .send({ message: `${err.name} | ID did not match expected format` });
      }
      if (err.name === "NoIdFoundError") {
        return res.status(err.status).send({ message: err.name + err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: err.name + err.message });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  getClothingItemById,
};

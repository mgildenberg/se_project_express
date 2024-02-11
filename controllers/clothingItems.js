const ClothingItem = require("../models/clothingItem");
const {
  SUCCESS,
  VALIDATION_ERROR,
  DOCUMENT_NOT_FOUND_ERROR,
  CAST_ERROR,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItem.find({}) // would return all the clothingItems
    .then((clothingItems) => res.status(SUCCESS).send({ clothingItems }))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

// used this to test
const getClothingItemById = (req, res) => {
  const clothingItemId = req.params.itemId;

  ClothingItem.findById(clothingItemId)
    .orFail(() => {
      const error = new Error(
        `No item found with the given ID: ${req.params.itemId}`,
      );
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then((clothingItem) => {
      res.status(SUCCESS).send({ clothingItem });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(DOCUMENT_NOT_FOUND_ERROR)
          .send({ message: err.message });
      } else if (err.name === "CastError") {
        return res
          .status(CAST_ERROR)
          .send({ message: `${err.name} | ID did not match expected format` });
      }
      return res.status(500).send({ message: err.name + err.message });
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
      res.status(201).send({ clothingItem });
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
      return res.status(500).send({ message: err.message });
    });
};

const deleteClothingItem = (req, res) => {
  const clothingItemId = req.params.itemId;
  // console.log("in deleteClothingItem", clothingItemId);
  // console.log("params of deleteClothingItem", req.params);
  // console.log("body of deleteClothingItem", req.body);

  ClothingItem.findByIdAndRemove(clothingItemId)
    .orFail(() => {
      const noIdFoundError = new Error(
        `No item found with the given ID: ${req.params.itemId}`,
      );

      noIdFoundError.name = "NoIdFoundError";
      noIdFoundError.status = 404;
      throw noIdFoundError;
    })
    // .orFail()
    .then((clothingItem) => {
      res.status(SUCCESS).send({ clothingItem });
    })
    .catch((err) => {
      console.log(err.name);
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(DOCUMENT_NOT_FOUND_ERROR)
          .send({ message: `${err.name} | ${err.message}` });
      } else if (err.name === "CastError") {
        return res
          .status(CAST_ERROR)
          .send({ message: `${err.name} | ID did not match expected format` });
      } else if (err.name === "NoIdFoundError") {
        return res.status(404).send({ message: err.name + err.message });
      }
      return res.status(500).send({ message: err.name + err.message });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  getClothingItemById,
};

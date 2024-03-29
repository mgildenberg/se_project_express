const ClothingItem = require("../models/clothingItem");
const {
  CREATED,
  VALIDATION_ERROR,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const getClothingItems = (req, res, next) => {
  ClothingItem.find({}) // would return all the clothingItems
    .then((clothingItems) => res.send({ clothingItems }))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const userId = req.user._id;
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: userId,
  })
    .then((clothingItem) => {
      res.status(CREATED).send(clothingItem);
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Incorrect or invalid data"));
      } else {
        next(err);
      }
    });
};

// used this to test
const getClothingItemById = (req, res, next) => {
  const clothingItemId = req.params.itemId;

  ClothingItem.findById(clothingItemId)
    .orFail(() => {
      throw new NotFoundError(
        ` No item found with the given ID: ${clothingItemId}`,
      );
    })
    .then((clothingItem) => {
      res.send({ clothingItem });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      // if (err.name === "ItemNotFoundError") {
      //   return res.status(err.status).send({ message: err.message });
      // }
      if (err.name === "CastError") {
        next(new BadRequestError("Incorrect or invalid data"));
      }
      next(err);
    });
};

const deleteClothingItem = (req, res, next) => {
  const clothingItemId = req.params.itemId;

  ClothingItem.findById(clothingItemId)
    .orFail(() => {
      throw new NotFoundError(
        `No item found with the given ID: ${req.params.itemId}`,
      );
    })
    .then((clothingItem) => {
      if (String(clothingItem.owner) === String(req.user._id)) {
        return ClothingItem.findByIdAndRemove(clothingItemId).then(() => {
          res.send({ message: "Item deleted" });
        });
      }
      throw new ForbiddenError("Cannot delete another user's item");
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(
          new BadRequestError(`${err.name} | ID did not match expected format`),
        );
      }
      next(err);
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  getClothingItemById,
};

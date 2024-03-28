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

const getClothingItems = (req, res) => {
  ClothingItem.find({}) // would return all the clothingItems
    .then((clothingItems) => res.send({ clothingItems }))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

// used this to test
// const getClothingItemById = (req, res) => {
//   const clothingItemId = req.params.itemId;

//   ClothingItem.findById(clothingItemId)
//     .orFail(() => {
//       const error = new Error(
//         ` No item found with the given ID: ${clothingItemId}`,
//       );
//       error.status = 404;
//       error.name = "ItemNotFoundError";
//       throw error;
//     })
//     .then((clothingItem) => {
//       res.send({ clothingItem });
//     })
//     .catch((err) => {
//       console.error(err);
//       console.log(err.name);
//       if (err.name === "ItemNotFoundError") {
//         return res.status(err.status).send({ message: err.message });
//       }
//       if (err.name === "CastError") {
//         return res
//           .status(VALIDATION_ERROR)
//           .send({ message: `${err.name} | ID did not match expected format` });
//       }
//       return res
//         .status(INTERNAL_SERVER_ERROR)
//         .send({ message: "An error has occurred on the server." });
//     });
// };

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
      res.status(CREATED).send(clothingItem);
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Incorrect or invalid data"));
        // return res
        //   .status(VALIDATION_ERROR)
        //   .send({ message: `${err.name} | ${err.message}` });
      } else {
        next(err);
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
};

const deleteClothingItem = (req, res) => {
  const clothingItemId = req.params.itemId;

  ClothingItem.findById(clothingItemId)
    .orFail(() => {
      // const noIdFoundError = new Error(
      //   `No item found with the given ID: ${req.params.itemId}`,
      // );
      // noIdFoundError.name = "NoIdFoundError";
      // noIdFoundError.status = 404;
      // throw noIdFoundError;
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
      // const wrongUserError = new Error("Cannot delete another user's item");
      // wrongUserError.name = "WrongUserError";
      // wrongUserError.status = 403;
      // throw wrongUserError;
      throw new (ForbiddenError("Cannot delete another user's item"))();
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(VALIDATION_ERROR)
          .send({ message: `${err.name} | ID did not match expected format` });
      }
      // if (err.name === "WrongUserError") {
      //   return res.status(err.status).send({ message: err.name + err.message });
      // }
      // if (err.name === "NoIdFoundError") {
      //   return res.status(err.status).send({ message: err.name + err.message });
      // }
      next(err);
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
};

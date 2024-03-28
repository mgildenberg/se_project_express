const ClothingItem = require("../models/clothingItem");
const {
  DOCUMENT_NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  VALIDATION_ERROR,
} = require("../utils/errors");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");

// PUT /items/:itemId/likes — like an item
// DELETE /items/:itemId/likes — unlike an item

const updateLike = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail()
    .then((like) => {
      res.send(like);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
        // return res
        //   .status(DOCUMENT_NOT_FOUND_ERROR)
        //   .send({ message: `${err.name} | ${err.message}` });
      }
      if (err.name === "CastError") {
        return res
          .status(VALIDATION_ERROR)
          .send({ message: `${err.name} | ${err.message}` });
      }
      next(err);
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
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
      res.send(like);
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
        // return res
        //   .status(DOCUMENT_NOT_FOUND_ERROR)
        //   .send({ message: err.message });
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Incorrect or invalid data"));
        // return res
        //   .status(VALIDATION_ERROR)
        //   .send({ message: `${err.name} | ${err.message}` });
      }

      next(err);
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { updateLike, deleteLike };

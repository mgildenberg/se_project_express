const ClothingItem = require("../models/clothingItem");
const {
  SUCCESS,
  VALIDATION_ERROR,
  DOCUMENT_NOT_FOUND_ERROR,
  CAST_ERROR,
} = require("../utils/errors");

// GET /items
const getClothingItems = (req, res) => {
  ClothingItem.find({}) // would return all the clothingItems
    .then((clothingItems) => res.status(200).send({ clothingItems }))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const getClothingItemById = (req, res) => {
  // console.log(req);
  const clothingItemId = req.params.itemId;
  // console.log("clothingItemId", clothingItemId);
  // console.log(clothingItemId);
  // console.log("in getClothingItemById", clothingItemId);
  // console.log("params of getClothingItemById", req.params);
  // console.log("body of getClothingItemById", req.body);

  ClothingItem.findById(clothingItemId)
    .orFail(() => {
      const error = new Error(
        "No item found with the given ID: " + req.params.itemId,
      );
      error.name = "DocumentNotFoundError";
      throw error;
    })
    // .orFail()
    .then((clothingItem) => {
      res.status(SUCCESS).send({ clothingItem });
    })
    .catch((err) => {
      // console.error(err);
      console.log(err.name);
      if (err.name === "DocumentNotFoundError") {
        // console.log("It's a documentnotfounderror");
        return res
          .status(DOCUMENT_NOT_FOUND_ERROR)
          .send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(CAST_ERROR).send({ message: err.name + err.message });
      }
      return res.status(500).send({ message: err.name + err.message });
    });
};

const createClothingItem = (req, res) => {
  // console.log("req", req);
  // console.log("req body", req.body);
  // console.log("req user", req.user);
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
        return res.status(VALIDATION_ERROR).send({ message: err.message });
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
        "No item found with the given ID: " + req.params.itemId,
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
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(DOCUMENT_NOT_FOUND_ERROR)
          .send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(CAST_ERROR).send({ message: err.name + err.message });
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
// module.exports.createClothingItem = (req, res) => {
//   console.log(req.user._id); // _id will become accessible
// };

// // EDIT ME
// const ClothingItem = require("../models/clothingItem");
// const {
//   SUCCESS,
//   VALIDATION_ERROR,
//   DOCUMENT_NOT_FOUND_ERROR,
//   CAST_ERROR,
// } = require("../utils/errors");

// // GET /items
// const getClothingItems = (req, res) => {
//   ClothingItem.find({}) // would return all the clothingItems
//     .then((clothingItems) => res.status(200).send({ clothingItems }))
//     .catch((err) => {
//       console.error(err);
//       return res.status(500).send({ message: err.message });
//     });
// };

// const getClothingItemById = (req, res) => {
//   const { clothingItemId } = req.params;
//   console.log("clothingItemId", clothingItemId);

//   ClothingItem.findById(clothingItemId)
//     .orFail(() => {
//       const error = new Error("No item found with the given ID");
//       error.name = "DocumentNotFoundError";
//       throw error;
//     })
//     // .orFail()
//     .then((clothingItem) => {
//       res.status(SUCCESS).send({ clothingItem });
//     })
//     .catch((err) => {
//       // console.error(err);
//       console.log(err.name);
//       if (err.name === "DocumentNotFoundError") {
//         console.log("It's a documentnotfounderror");
//         return res
//           .status(DOCUMENT_NOT_FOUND_ERROR)
//           .send({ message: err.message });
//       } else if (err.name === "CastError") {
//         return res.status(CAST_ERROR).send({ message: err.name + err.message });
//       }
//       return res.status(500).send({ message: err.name + err.message });
//     });
// };

// const createClothingItem = (req, res) => {
//   console.log("req", req);
//   console.log("req body", req.body);
//   console.log("req user", req.user);
//   const { name, weather, imageUrl } = req.body;
//   const userId = req.user._id;
//   ClothingItem.create({
//     name,
//     weather,
//     imageUrl,
//     owner: userId,
//   })
//     .then((clothingItem) => {
//       res.status(201).send({ clothingItem });
//       console.log({ clothingItem });
//     })
//     .catch((err) => {
//       console.error(err);
//       console.log(err.name);
//       if (err.name === "ValidationError") {
//         return res.status(VALIDATION_ERROR).send({ message: err.message });
//       }
//       return res.status(500).send({ message: err.message });
//     });
// };

// const deleteClothingItem = (req, res) => {
//   const { clothingItemId } = req.params;
//   console.log("clothingItemId", clothingItemId);

//   ClothingItem.findByIdAndDelete(clothingItemId)
//     .orFail(() => {
//       const error = new Error("No item found with the given ID");
//       error.name = "NoIdFoundError ";
//       error.status = 400;
//       throw error;
//     })
//     // .orFail()
//     .then((clothingItem) => {
//       res.status(200).send({ clothingItem });
//     })
//     .catch((err) => {
//       // console.error(err);
//       console.log(err.name);
//       if (err.name === "DocumentNotFoundError") {
//         console.log("It's a documentnotfounderror");
//         return res
//           .status(DOCUMENT_NOT_FOUND_ERROR)
//           .send({ message: err.message });
//       } else if (err.name === "CastError") {
//         return res.status(CAST_ERROR).send({ message: err.name + err.message });
//       } else if (err.name === "NoIdFoundError") {
//         return res.status(400).send({ message: err.name + err.message });
//       }
//       return res.status(500).send({ message: err.name + err.message });
//     });
// };

// module.exports = {
//   getClothingItems,
//   getClothingItemById,
//   createClothingItem,
//   deleteClothingItem,
// };
// // module.exports.createClothingItem = (req, res) => {
// //   console.log(req.user._id); // _id will become accessible
// // };

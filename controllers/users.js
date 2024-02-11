const User = require("../models/user");
const {
  VALIDATION_ERROR,
  CAST_ERROR,
  DOCUMENT_NOT_FOUND_ERROR,
  SUCCESS,
} = require("../utils/errors");

// GET /users
const getUsers = (req, res) => {
  User.find({}) // would return all the users
    .then((users) => res.status(SUCCESS).send(users))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(DOCUMENT_NOT_FOUND_ERROR)
          .send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(VALIDATION_ERROR).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(DOCUMENT_NOT_FOUND_ERROR)
          .send({ message: err.message });
      } else if (err.name === "CastError") {
        return res
          .status(CAST_ERROR)
          .send({ message: err.name + " | ID did not match expected format" });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };

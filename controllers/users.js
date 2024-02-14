const User = require("../models/user");
const {
  VALIDATION_ERROR,
  CAST_ERROR,
  CREATED,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");
const bcrypt = require("bcryptjs");

const login = (req, res) => {
  console.log(" hi hi login part ");
};

// GET /users
const getUsers = (req, res) => {
  User.find({}) // would return all the users
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(req.body.password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        res
          .status(CREATED)
          .send({ email: user.email, avatar: user.avatar, name: user.name });
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          return res.status(VALIDATION_ERROR).send({ message: err.message });
        }
        return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
      });
  });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      const error = new Error(`No user found with the given ID: ${userId}`);
      error.name = "UserNotFoundError";
      error.status = 404;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(CAST_ERROR)
          .send({ message: `${err.name} | ID did not match expected format` });
      }
      if (err.name === "UserNotFoundError") {
        return res
          .status(err.status)
          .send({ message: `${err.name} | ${err.message}` });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser, login };

const User = require("../models/user");
const {
  VALIDATION_ERROR,
  CAST_ERROR,
  CREATED,
  INTERNAL_SERVER_ERROR,
  CONFLICT_ERROR,
  UNAUTHORIZED_ERROR,
  DOCUMENT_NOT_FOUND_ERROR,
} = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const login = (req, res) => {
  const { email, password } = req.body;
  console.log(" hi hi login in controller");
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      //return res.status(400).send({ message: err.message });
      return res.status(400).send({ message: err.message });
    });
};

// GET /users
const getUsers = (req, res) => {
  User.find({}) // would return all the users
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  console.log("we are in getCurrentUser");

  // Extract user ID from req.user, set by auth middleware
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(DOCUMENT_NOT_FOUND_ERROR)
          .send({ message: "User not found" });
      }
      // Return user data, excluding password
      const { email, name, avatar } = user;
      res.send({ email, name, avatar });
    })
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
        console.error(err);
        console.log(err.name);
        if (err.name === "ValidationError") {
          return res.status(VALIDATION_ERROR).send({ message: err.message });
        }
        if (err.code === 11000) {
          //MongoDB duplicate error
          return res
            .status(CONFLICT_ERROR)
            .send({ message: "Duplicate email error: Email already exists." });
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
      console.error(err);
      console.log(err.name);
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

module.exports = { getUsers, createUser, getUser, login, getCurrentUser };

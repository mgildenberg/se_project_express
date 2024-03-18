const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  VALIDATION_ERROR,
  CREATED,
  INTERNAL_SERVER_ERROR,
  CONFLICT_ERROR,
  DOCUMENT_NOT_FOUND_ERROR,
  UNAUTHORIZED_ERROR,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const login = (req, res) => {
  const { email, password } = req.body;
  // console.log("backend", { email, password });

  // Looks for missing fields in request and returns error before findUserByCredentials is run
  if (!email || !password) {
    return res
      .status(VALIDATION_ERROR)
      .send({ message: "Incorrect email or password" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res.status(UNAUTHORIZED_ERROR).send({ message: err.message });
      }
      console.error(err);
      console.log(err.name);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const getCurrentUser = (req, res) => {
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
      const { email, name, avatar, _id } = user;
      return res.send({ email, name, avatar, _id });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateCurrentUser = (req, res) => {
  console.log("in updateCurrentUser");
  console.log(req);
  const userId = req.user._id;
  const { name, avatar } = req.body;
  const update = { name, avatar };

  User.findOneAndUpdate({ _id: userId }, update, {
    new: true,
    runValidators: true,
  })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res
          .status(DOCUMENT_NOT_FOUND_ERROR)
          .send({ message: "User not found" });
      }
      return res.send({ name: updatedUser.name, avatar: updatedUser.avatar });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(VALIDATION_ERROR).send({ message: err.message });
      }
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) =>
        res
          .status(CREATED)
          .send({ email: user.email, avatar: user.avatar, name: user.name }),
      )
      .catch((err) => {
        console.error(err);
        console.log(err.name);
        if (err.name === "ValidationError") {
          return res.status(VALIDATION_ERROR).send({ message: err.message });
        }
        if (err.code === 11000) {
          return res
            .status(CONFLICT_ERROR)
            .send({ message: "Duplicate email error: Email already exists." });
        }
        return res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server." });
      });
  });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};

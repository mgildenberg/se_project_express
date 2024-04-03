const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const { JWT_SECRET } = require("../utils/config");

const login = (req, res, next) => {
  const { email, password } = req.body;

  // Looks for missing fields in request and returns error before findUserByCredentials is run
  if (!email || !password) {
    throw new UnauthorizedError("Incorrect email or password");
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
        // return res.status(UNAUTHORIZED_ERROR).send({ message: err.message });
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        console.error(err);
        console.log(err.name);
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  // Extract user ID from req.user, set by auth middleware
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("No user with matching ID found");
      }
      // Return user data, excluding password
      const { email, name, avatar, _id } = user;
      return res.send({ email, name, avatar, _id });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const updateCurrentUser = (req, res, next) => {
  console.log("in updateCurrentUser");
  console.log(req.user);
  const userId = req.user._id;
  const { name, avatar } = req.body;
  const update = { name, avatar };

  User.findOneAndUpdate({ _id: userId }, update, {
    new: true,
    runValidators: true,
  })
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new NotFoundError("User not found");
      }
      return res.send({
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        _id: userId,
        email: updatedUser.email,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) =>
        res
          .status(201)
          .send({ email: user.email, avatar: user.avatar, name: user.name }),
      )
      .catch((err) => {
        console.error(err);
        console.log(err.name);
        if (err.name === "ValidationError") {
          next(new BadRequestError(err.message));
          // return res.status(VALIDATION_ERROR).send({ message: err.message });
        }
        if (err.code === 11000) {
          next(
            new ConflictError("Duplicate email error: Email already exists."),
          );
        }

        next(err);
      });
  });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};

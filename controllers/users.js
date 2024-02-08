const User = require("../models/user");

// GET /users
const getUsers = (req, res) => {
  User.find({}) // would return all the users
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(500).send(err.message);
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  console.log(name, avatar);

  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        return res.status(400).send(err.message);
      }
      return res.status(500).send(err.message);
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
      console.error(err);
      console.log(err.name);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send(err.message);
      } else if (err.name === "CastError") {
        return res.status(500).send(err.message);
      }
      return res.status(500).send(err.message);
    });
};

module.exports = { getUsers, createUser, getUser };
